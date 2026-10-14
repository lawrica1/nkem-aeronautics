"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";
import { hasAccount } from "@/lib/api";

const WHATSAPP_NUMBER = "237670439117";

// Jump links under the hero card, styled as the template's feature tabs.
const HIGHLIGHTS = [
  { label: "Precision Aerial Spraying", href: "#services" },
  { label: "Farmer Logbook IDs", href: "#logbook" },
  { label: "Fleet Capabilities", href: "#fleet" },
];

function HudScale({ flip }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-x-[8%] flex items-center gap-3 ${flip ? "bottom-10 sm:bottom-12" : "top-10 sm:top-12"}`}
    >
      <span className={`hud-ticks h-3 flex-1 ${flip ? "rotate-180" : ""}`} />
      <span className="rounded border border-white/30 bg-white/10 px-2 py-0.5 font-mono text-[10px] tracking-widest text-white/80 backdrop-blur-sm">
        {flip ? "28.28°E" : "15.42°S"}
      </span>
      <span className={`hud-ticks h-3 flex-1 ${flip ? "rotate-180" : ""}`} />
    </div>
  );
}

export function Hero() {
  // Starts false to match the server render, then syncs after mount —
  // reading localStorage directly during render would mismatch SSR output.
  const [returning, setReturning] = useState(false);

  useEffect(() => {
    setReturning(hasAccount());
  }, []);

  return (
    <section className="bg-white px-4 pt-6 sm:px-6 sm:pt-8">
      <div className="mx-auto max-w-6xl">
        <div className="clip-notch relative isolate flex min-h-[34rem] items-center overflow-hidden rounded-3xl bg-brand-black text-white sm:min-h-[36rem]">
          {/* Background video only — no poster, so the card's dark fill shows until the first frame loads. */}
          <video
            className="absolute inset-0 -z-20 size-full object-cover"
            src="/videos/hero-background.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-black/90 via-brand-black/55 to-brand-black/30" />

          <HudScale />
          <HudScale flip />

          <div className="grid w-full gap-10 px-6 py-28 sm:px-12 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:px-16">
            <h1 className="animate-fade-up font-display text-[2.1rem] leading-[1.12] font-light tracking-[-0.02em] text-balance sm:text-5xl lg:text-[3.6rem]">
              Advanced Aerial Solutions &amp; Unmanned Aerial Vehicles Manufacturer
            </h1>

            <div className="animate-fade-up flex flex-col gap-6" style={{ animationDelay: "150ms" }}>
              <p className="text-sm leading-relaxed text-white/80 sm:text-base">
                Providing cutting-edge UAV technology, site preparation equipment, and autonomous
                surveillance operations tailored across Zambia and Africa.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={returning ? "/login" : "/signup"}
                  className="group inline-flex items-center gap-2 rounded-md bg-brand-blue px-6 py-3 text-xs font-semibold tracking-[0.12em] text-white uppercase transition-colors hover:bg-brand-blue-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {returning ? "Log In to Portal" : "Sign Up — Nkem Portal"}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/5 px-6 py-3 text-xs font-semibold tracking-[0.12em] text-white uppercase backdrop-blur-sm transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <MessageCircle className="size-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        <nav aria-label="Highlights" className="mt-6 grid grid-cols-3 border-b border-neutral-200 text-center">
          {HIGHLIGHTS.map(({ label, href }, i) => (
            <a
              key={href}
              href={href}
              className={`relative px-2 pb-4 text-[10px] font-semibold tracking-[0.14em] uppercase transition-colors hover:text-brand-blue sm:text-xs ${
                i === 0 ? "text-brand-black" : "text-neutral-500"
              }`}
            >
              {label}
              {i === 0 && <span className="absolute inset-x-[15%] -bottom-px h-0.5 bg-brand-blue" />}
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
