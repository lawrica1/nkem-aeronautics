import Anthropic from "@anthropic-ai/sdk";
import { enforce } from "../../shared/utils/rateLimit.js";
import { streamAnswer, validateMessages } from "./assistant.service.js";

const FALLBACK_TEXT =
  "Sorry, I can't help with that here. Please contact our team at /contact or on WhatsApp at +237 670 439 117.";
const ERROR_TEXT =
  "\n\nSorry, something went wrong while answering. Please try again, or contact us at /contact.";

// Streams the answer back as plain text chunks. Errors before the first chunk go through the
// normal JSON error handler; after that the status is already sent, so a note is appended instead.
export async function chat(req, res) {
  enforce(`assistant:${req.ip}`, { limit: 30, windowMs: 60 * 60_000 }, "You've sent a lot of messages.");
  const messages = validateMessages(req.body?.messages);
  const stream = streamAnswer(messages);

  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    res.status(200);
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();
  };

  // Stop generating (and paying for) tokens when the visitor closes the chat mid-answer.
  res.on("close", () => {
    if (!res.writableFinished) stream.abort();
  });

  stream.on("text", (text) => {
    start();
    res.write(text);
  });

  try {
    const message = await stream.finalMessage();
    if (message.stop_reason === "refusal") {
      const hadText = started;
      start();
      res.write(hadText ? `\n\n${FALLBACK_TEXT}` : FALLBACK_TEXT);
    }
    const u = message.usage;
    console.log(
      `[assistant] model=${message.model} stop=${message.stop_reason} in=${u.input_tokens} cache_read=${u.cache_read_input_tokens ?? 0} cache_write=${u.cache_creation_input_tokens ?? 0} out=${u.output_tokens}`,
    );
    start();
    res.end();
  } catch (err) {
    if (err instanceof Anthropic.APIUserAbortError) return; // visitor left; nothing to send
    if (!started) throw err;
    console.error("[assistant] stream failed:", err instanceof Anthropic.APIError ? `${err.status} ${err.message}` : err);
    res.end(ERROR_TEXT);
  }
}
