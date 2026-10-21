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

  // Stop generating (and paying for) tokens when the visitor closes the chat mid-answer.
  const abort = new AbortController();
  res.on("close", () => {
    if (!res.writableFinished) abort.abort();
  });
  const answer = streamAnswer(messages, abort.signal);

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

  try {
    for await (const part of answer) {
      if (part.done) {
        if (part.refused) {
          const hadText = started;
          start();
          res.write(hadText ? `\n\n${FALLBACK_TEXT}` : FALLBACK_TEXT);
        }
        console.log(`[assistant] ${part.log}`);
      } else {
        start();
        res.write(part.text);
      }
    }
    start();
    res.end();
  } catch (err) {
    if (abort.signal.aborted) return; // visitor left; nothing to send
    if (!started) throw err;
    console.error("[assistant] stream failed:", err?.status ? `${err.status} ${err.message}` : err);
    res.end(ERROR_TEXT);
  }
}
