"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUp, Bot, MessageCircle, RotateCcw, X } from "lucide-react";
import { getApiBaseUrl } from "@/lib/api";
import { cn } from "@/lib/utils";

const GREETING =
  "Hello! I'm the Nkem Aeronautics assistant. Ask me about our drones, spraying equipment, services, or how to register and request a service.";
const SUGGESTIONS = [
  "Which drone is best for farm mapping?",
  "How do I register as a farmer?",
  "What spraying equipment do you offer?",
];
const UNAVAILABLE =
  "The assistant isn't available right now. You can reach our team through /contact or on WhatsApp at +237 670 439 117.";

// Turns site paths (/products/...), web links and emails in plain-text answers into links,
// without ever injecting HTML.
const LINK_RE = /(https?:\/\/[^\s)]*[^\s).,!?]|\/(?:products|services|signup|login|logbook|contact|about|customer-service|forgot-password|downloads)[^\s),.]*|[\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;
function Linkified({ text }) {
  const parts = text.split(LINK_RE);
  return parts.map((part, i) => {
    if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
    const cls = "font-medium text-brand-blue underline underline-offset-2";
    if (part.startsWith("/")) {
      return (
        <Link key={i} href={part} className={cls}>
          {part}
        </Link>
      );
    }
    const href = part.includes("@") && !part.startsWith("http") ? `mailto:${part}` : part;
    return (
      <a key={i} href={href} target="_blank" rel="noreferrer" className={cls}>
        {part}
      </a>
    );
  });
}

export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]); // { role: "user" | "assistant", content }
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  async function send(text) {
    const question = text.trim();
    if (!question || busy) return;
    const history = [...messages, { role: "user", content: question }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);

    const controller = new AbortController();
    abortRef.current = controller;
    const appendToLast = (chunk) =>
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { ...next[next.length - 1], content: next[next.length - 1].content + chunk };
        return next;
      });

    try {
      const res = await fetch(`${getApiBaseUrl()}/assistant/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        appendToLast(res.status === 503 || !data?.message ? UNAVAILABLE : data.message);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        appendToLast(decoder.decode(value, { stream: true }));
      }
    } catch (err) {
      if (err.name !== "AbortError") appendToLast(UNAVAILABLE);
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  function reset() {
    abortRef.current?.abort();
    setMessages([]);
    setInput("");
  }

  return (
    <>
      {open && (
        <section
          role="dialog"
          aria-label="Nkem Aeronautics assistant"
          className="fixed inset-x-3 bottom-24 z-50 flex max-h-[min(36rem,calc(100dvh-8rem))] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_24px_60px_-20px_rgba(11,13,18,0.45)] sm:inset-x-auto sm:right-6 sm:w-[24rem]"
        >
          <header className="flex items-center gap-3 border-b border-neutral-200 px-4 py-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-brand-blue text-white">
              <Bot className="size-4.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm text-brand-black">Nkem Assistant</p>
              <p className="text-[11px] text-neutral-500">AI answers from our catalog. Check details with our team.</p>
            </div>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={reset}
                aria-label="Start a new chat"
                className="flex size-8 items-center justify-center rounded-md text-neutral-500 hover:bg-brand-gray-light hover:text-brand-black"
              >
                <RotateCcw className="size-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="flex size-8 items-center justify-center rounded-md text-neutral-500 hover:bg-brand-gray-light hover:text-brand-black"
            >
              <X className="size-4" />
            </button>
          </header>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-brand-paper px-4 py-4" aria-live="polite">
            <p className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 text-sm leading-relaxed text-brand-black shadow-sm">
              {GREETING}
            </p>
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-left text-xs text-brand-black transition-colors hover:border-brand-blue hover:text-brand-blue"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {messages.map((m, i) => (
              <p
                key={i}
                className={cn(
                  "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed break-words whitespace-pre-wrap",
                  m.role === "user"
                    ? "ml-auto rounded-tr-sm bg-brand-blue text-white"
                    : "rounded-tl-sm bg-white text-brand-black shadow-sm",
                )}
              >
                {m.content ? (
                  m.role === "assistant" ? <Linkified text={m.content} /> : m.content
                ) : (
                  <span className="inline-flex gap-1" aria-label="Assistant is typing">
                    {[0, 150, 300].map((d) => (
                      <span key={d} className="size-1.5 animate-bounce rounded-full bg-neutral-400" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </span>
                )}
              </p>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2 border-t border-neutral-200 bg-white p-3"
          >
            <label htmlFor="assistant-input" className="sr-only">
              Your question
            </label>
            <textarea
              id="assistant-input"
              ref={inputRef}
              rows={1}
              maxLength={2000}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask a question…"
              className="max-h-28 min-h-10 flex-1 resize-none rounded-xl border border-neutral-300 px-3 py-2.5 text-sm text-brand-black outline-none placeholder:text-neutral-400 focus:border-brand-blue"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send"
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-blue text-white transition-colors hover:bg-brand-blue-dark disabled:opacity-40"
            >
              <ArrowUp className="size-4" />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close assistant" : "Ask the Nkem assistant"}
        className="fixed right-4 bottom-5 z-50 flex items-center gap-2 rounded-full bg-brand-blue py-3.5 pr-5 pl-4 text-sm font-semibold text-white shadow-[0_12px_30px_-8px_rgba(45,53,245,0.7)] transition-colors hover:bg-brand-blue-dark sm:right-6 sm:bottom-6"
      >
        {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
        <span className={cn(open && "sr-only")}>Ask Nkem</span>
      </button>
    </>
  );
}
