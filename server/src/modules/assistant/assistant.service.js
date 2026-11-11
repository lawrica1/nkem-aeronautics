import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";
import { env } from "../../config/env.js";
import { HttpError } from "../../shared/errors/HttpError.js";
import { SYSTEM_PROMPT } from "./assistant.prompt.js";

const CLAUDE_MODEL = "claude-opus-5-5";
const MAX_TURNS = 20;
const MAX_MESSAGE_CHARS = 2000;
const MAX_TOTAL_CHARS = 16000;

// Gemini finish reasons that mean the answer was blocked rather than completed.
const GEMINI_BLOCKED = new Set(["SAFETY", "RECITATION", "BLOCKLIST", "PROHIBITED_CONTENT", "SPII"]);

const sleep = (ms, signal) =>
  new Promise((resolve) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => (clearTimeout(t), resolve()), { once: true });
  });

let anthropic;
let gemini;

// Accepts the browser's chat history and returns clean user/assistant turns, or throws a 400.
export function validateMessages(raw) {
  if (!Array.isArray(raw) || raw.length === 0) throw new HttpError(400, "messages must be a non-empty array.");
  const messages = raw.slice(-MAX_TURNS).map((m) => {
    if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string") {
      throw new HttpError(400, "Each message needs a role of user or assistant and text content.");
    }
    const content = m.content.trim();
    if (!content) throw new HttpError(400, "Messages cannot be empty.");
    if (content.length > MAX_MESSAGE_CHARS) throw new HttpError(400, `Messages are limited to ${MAX_MESSAGE_CHARS} characters.`);
    return { role: m.role, content };
  });
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    throw new HttpError(400, "The conversation must end with a visitor message.");
  }
  if (messages.reduce((n, m) => n + m.content.length, 0) > MAX_TOTAL_CHARS) {
    throw new HttpError(400, "This conversation is too long. Please start a new chat.");
  }
  return messages;
}

// Starts a streamed answer from whichever provider has a key (Claude first, then Gemini).
// Returns an async generator of { text } chunks ending with one { done, refused, log } item.
// Throws a 503 straight away when no provider is configured.
export function streamAnswer(messages, signal) {
  if (env.anthropicApiKey) return streamClaude(messages, signal);
  if (env.geminiApiKey) return streamGemini(messages, signal);
  throw new HttpError(503, "The assistant is not available right now.");
}

// The system prompt is cached (it is identical on every request), and server-side fallback
// re-runs a safety-declined request on Anthropic's recommended model.
async function* streamClaude(messages, signal) {
  anthropic ??= new Anthropic({ apiKey: env.anthropicApiKey });
  const stream = anthropic.beta.messages.stream(
    {
      model: CLAUDE_MODEL,
      max_tokens: 8000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low" },
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages,
    },
    { signal },
  );
  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") yield { text: event.delta.text };
  }
  const message = await stream.finalMessage();
  const u = message.usage;
  yield {
    done: true,
    refused: message.stop_reason === "refusal",
    log: `model=${message.model} stop=${message.stop_reason} in=${u.input_tokens} cache_read=${u.cache_read_input_tokens ?? 0} cache_write=${u.cache_creation_input_tokens ?? 0} out=${u.output_tokens}`,
  };
}

// Gemini's free tier sometimes queues requests for 30s+ at busy times. If the first word hasn't
// arrived by then, the same question also goes to the fallback model and the faster one wins.
const HEDGE_AFTER_MS = 6000;

const visibleText = (chunk) =>
  chunk?.candidates?.[0]?.content?.parts
    ?.filter((p) => typeof p.text === "string" && !p.thought)
    .map((p) => p.text)
    .join("") ?? "";

async function* streamGemini(messages, signal) {
  gemini ??= new GoogleGenAI({ apiKey: env.geminiApiKey });
  const contents = messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));
  const request = (model, config, abortSignal) =>
    gemini.models.generateContentStream({
      model,
      contents,
      config: { systemInstruction: SYSTEM_PROMPT, maxOutputTokens: 4096, abortSignal, ...config },
    });

  // Opens a stream on one model and waits for its first visible text (or its end), so callers
  // can tell which model is actually answering. Each attempt can be cancelled on its own.
  const open = async (model, ctrl = new AbortController()) => {
    if (signal?.aborted) ctrl.abort();
    signal?.addEventListener("abort", () => ctrl.abort(), { once: true });
    try {
      // Catalog questions don't need long reasoning, and thinking delays the first word.
      // Models that don't accept a thinking level reject it with a 400, so retry without it.
      let stream;
      try {
        stream = await request(model, { thinkingConfig: { thinkingLevel: "MINIMAL" } }, ctrl.signal);
      } catch (err) {
        if (err?.status !== 400 || ctrl.signal.aborted) throw err;
        stream = await request(model, {}, ctrl.signal);
      }
      const it = stream[Symbol.asyncIterator]();
      for (;;) {
        const { value, done } = await it.next();
        if (done) return { model, ctrl, it, first: "", last: undefined, ended: true };
        const text = visibleText(value);
        if (text || value?.candidates?.[0]?.finishReason || value?.promptFeedback?.blockReason) {
          return { model, ctrl, it, first: text, last: value, ended: false };
        }
      }
    } catch (err) {
      ctrl.abort();
      throw err;
    }
  };

  const [main, backup] = [env.geminiModel, env.geminiFallbackModel];
  const ctrls = [new AbortController()];
  const tries = [open(main, ctrls[0])];
  if (backup) {
    // Start the backup model when the main one fails (e.g. 503 "high demand") or is slow.
    const settled = await Promise.race([
      tries[0].then(() => "ok", () => "failed"),
      sleep(HEDGE_AFTER_MS, signal).then(() => "slow"),
    ]);
    if (settled !== "ok" && !signal?.aborted) {
      console.warn(`[assistant] ${main} ${settled}, also asking ${backup}`);
      ctrls.push(new AbortController());
      tries.push(open(backup, ctrls[1]));
    }
  }
  let winner;
  try {
    winner = await Promise.any(tries);
  } catch (err) {
    const first = err.errors?.[0] ?? err;
    // Both busy: one last try on the main model after a short pause.
    if (signal?.aborted || ![429, 500, 503].includes(first?.status)) throw first;
    await sleep(1000, signal);
    winner = await open(main);
  }
  // Cancel the slower attempt right away so it stops using quota.
  for (const ctrl of ctrls) if (ctrl !== winner.ctrl) ctrl.abort();

  const model = winner.model;
  let last = winner.last;
  if (winner.first) yield { text: winner.first };
  while (!winner.ended) {
    const { value, done } = await winner.it.next();
    if (done) break;
    last = value;
    const text = visibleText(value);
    if (text) yield { text };
  }
  const finish = last?.candidates?.[0]?.finishReason ?? "none";
  const blocked = last?.promptFeedback?.blockReason;
  const u = last?.usageMetadata ?? {};
  yield {
    done: true,
    refused: Boolean(blocked) || GEMINI_BLOCKED.has(finish),
    log: `model=${model} stop=${blocked ?? finish} in=${u.promptTokenCount ?? 0} out=${u.candidatesTokenCount ?? 0}`,
  };
}
