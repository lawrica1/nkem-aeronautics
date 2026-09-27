"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const H2 = "text-3xl font-bold tracking-tight text-brand-navy-dark sm:text-4xl";
const LABEL = "text-xs font-semibold tracking-widest text-brand-blue uppercase";

export function FaqSection({ section: s, alt }) {
  const [open, setOpen] = useState(0);

  return (
    <section
      id={s.id}
      className={`scroll-mt-16 px-6 py-20 sm:py-24 ${alt ? "bg-brand-gray-light" : "bg-white"}`}
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          {s.label && <p className={LABEL}>{s.label}</p>}
          <h2 className={`mt-2 ${H2}`}>{s.heading}</h2>
          {s.subtitle && (
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{s.subtitle}</p>
          )}
        </div>

        {/* Group label */}
        {s.group && (
          <div className="mx-auto mt-16 max-w-3xl">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-blue/10">
                <HelpCircle className="size-5 text-brand-blue" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-brand-navy-dark">{s.group}</h3>
                {s.groupIntro && (
                  <p className="mt-0.5 text-sm text-muted-foreground">{s.groupIntro}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Accordion */}
        <div className="mx-auto mt-8 max-w-3xl divide-y divide-border overflow-hidden rounded-xl border border-border bg-background">
          {s.items.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={faq.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-brand-gray-light"
                >
                  <span className={`font-semibold ${isOpen ? "text-brand-blue" : "text-brand-navy-dark"}`}>
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`size-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180 text-brand-blue" : ""}`}
                  />
                </button>
                {isOpen && (
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
