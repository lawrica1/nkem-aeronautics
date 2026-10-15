import Anthropic from "@anthropic-ai/sdk";
import { env } from "../../config/env.js";
import { HttpError } from "../../shared/errors/HttpError.js";
import { SYSTEM_PROMPT } from "./assistant.prompt.js";

const MODEL = "claude-opus-5-5";
const MAX_TURNS = 20;
const MAX_MESSAGE_CHARS = 2000;
const MAX_TOTAL_CHARS = 16000;

let client;
function getClient() {
  if (!env.anthropicApiKey) throw new HttpError(503, "The assistant is not available right now.");
  client ??= new Anthropic({ apiKey: env.anthropicApiKey });
  return client;
}

// Accepts the browser's chat history and returns clean Messages API turns, or throws a 400.
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

// Starts a streamed answer. The system prompt is cached (it is identical on every request), and
// server-side fallback re-runs a safety-declined request on Anthropic's recommended model.
export function streamAnswer(messages) {
  return getClient().beta.messages.stream({
    model: MODEL,
    max_tokens: 8000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "low" },
    system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
    messages,
  });
}
