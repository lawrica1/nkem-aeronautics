"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";
import { hasAccount } from "@/lib/api";
import { SERVICES } from "@/lib/services";

const WHATSAPP_NUMBER = "237670439117";

const CAPABILITIES = [
  { value: `${SERVICES.length}`, label: "Drone service lines" },
  { value: "SMS", label: "Verified farmer logbook IDs" },
  { value: "Card · MoMo", label: "Online payments, MTN & Orange" },
  { value: "Lusaka", label: "Headquarters, serving Africa" },
];

export function Hero() {
  // Starts false to match the server render, then syncs after mount —
  // reading localStorage directly during render would mismatch SSR output.
  const [returning, setReturning] = useState(false);

  useEffect(() => {
    setReturning(hasAccount());
  }, []);

  return (
    <section className="relative isolate flex min-h-[88svh] flex-col overflow-hidden bg-brand-navy-dark text-white">
      {/* Background video only — no poster, so the section's navy shows until the first frame loads. */}
      <video
        className="absolute inset-0 -z-20 size-full object-cover"
        src="/videos/hero-background.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(7,24,45,0.92) 0%, rgba(7,24,45,0.7) 40%, rgba(7,24,45,0.25) 75%, rgba(7,24,45,0.15) 100%), linear-gradient(180deg, rgba(7,24,45,0.4) 0%, rgba(7,24,45,0) 30%, rgba(7,24,45,0) 60%, rgba(7,24,45,0.85) 100%)",
        }}
      />

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 pt-16 pb-12 sm:pt-24">
        <p className="animate-fade-up flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] tracking-[0.18em] text-white/60 uppercase">
          <span className="inline-flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-brand-blue-light" />
            Zambia &middot; Africa
          </span>
          <span className="text-white/30">/</span>
          <span>15.42&deg;S 28.28&deg;E</span>
        </p>

        <h1
          className="animate-fade-up mt-6 max-w-4xl text-[2.6rem] leading-[1.02] font-semibold tracking-[-0.03em] text-balance sm:text-6xl lg:text-7xl"
          style={{ animationDelay: "100ms" }}
        >
          Advanced Aerial Solutions &amp;{" "}
          <span className="text-white/55">Unmanned Aerial Vehicles Manufacturer</span>
        </h1>

        <p
          className="animate-fade-up mt-7 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg"
          style={{ animationDelay: "200ms" }}
        >
          Providing cutting-edge UAV technology, site preparation equipment, and autonomous
          surveillance operations tailored across Zambia and Africa.
        </p>

        <div
          className="animate-fade-up mt-10 flex flex-wrap gap-3"
          style={{ animationDelay: "300ms" }}
        >
          <Link
            href={returning ? "/login" : "/signup"}
            className="group inline-flex items-center gap-2 rounded-full bg-brand-blue px-7 py-3.5 text-sm font-semibold text-white shadow-[0_8px_30px_-8px_rgba(45,53,245,0.8)] transition-colors hover:bg-brand-blue-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {returning ? "Log In to Portal" : "Sign Up — Nkem Aeronautics Portal"}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <MessageCircle className="size-4" />
            Chat on WhatsApp
          </a>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-4 py-3.5 text-sm font-semibold text-white/80 underline-offset-4 hover:text-white hover:underline"
          >
            Explore services
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10 bg-brand-navy-dark/60 backdrop-blur-md">
        <dl className="mx-auto grid w-full max-w-6xl grid-cols-2 px-6 lg:grid-cols-4">
          {CAPABILITIES.map(({ value, label }, i) => (
            <div
              key={label}
              className={`flex flex-col gap-1 py-5 lg:py-6 ${i % 2 === 1 ? "pl-5 sm:pl-8" : ""} ${i > 0 ? "lg:border-l lg:border-white/10 lg:pl-8" : ""} ${i % 2 === 1 ? "border-l border-white/10" : ""} ${i > 1 ? "border-t border-white/10 lg:border-t-0" : ""}`}
            >
              <dt className="order-2 text-xs text-white/55">{label}</dt>
              <dd className="order-1 text-lg font-semibold tracking-tight sm:text-xl">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
