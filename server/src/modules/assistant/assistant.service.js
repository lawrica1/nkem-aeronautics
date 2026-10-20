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

async function* streamGemini(messages, signal) {
  gemini ??= new GoogleGenAI({ apiKey: env.geminiApiKey });
  const stream = await gemini.models.generateContentStream({
    model: env.geminiModel,
    contents: messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
    config: { systemInstruction: SYSTEM_PROMPT, maxOutputTokens: 4096, abortSignal: signal },
  });
  let last;
  for await (const chunk of stream) {
    last = chunk;
    const text = chunk.candidates?.[0]?.content?.parts
      ?.filter((p) => typeof p.text === "string" && !p.thought)
      .map((p) => p.text)
      .join("");
    if (text) yield { text };
  }
  const finish = last?.candidates?.[0]?.finishReason ?? "none";
  const blocked = last?.promptFeedback?.blockReason;
  const u = last?.usageMetadata ?? {};
  yield {
    done: true,
    refused: Boolean(blocked) || GEMINI_BLOCKED.has(finish),
    log: `model=${env.geminiModel} stop=${blocked ?? finish} in=${u.promptTokenCount ?? 0} out=${u.candidatesTokenCount ?? 0}`,
  };
}
