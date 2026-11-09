"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";
import { hasAccount } from "@/lib/api";
import { Eyebrow } from "@/components/SectionHeading";

const WHATSAPP_NUMBER = "237670439117";

// Photo links under the title card, styled after the catalog cover strip.
const STRIP = [
  { label: "Precision Aerial Spraying", href: "/services/agricultural", image: "/images/services/agricultural-spraying.jpg" },
  { label: "Wildlife & Surveillance", href: "/services/wildlife", image: "/images/services/wildlife-surveillance.jpg" },
  { label: "Product Catalog 2026", href: "/products", image: "/images/about/manufacturing-facility.jpeg" },
];

export function Hero() {
  // Starts false to match the server render, then syncs after mount —
  // reading localStorage directly during render would mismatch SSR output.
  const [returning, setReturning] = useState(false);

  useEffect(() => {
    setReturning(hasAccount());
  }, []);

  return (
    <section className="relative isolate bg-brand-paper">
      <div className="relative h-[24rem] w-full overflow-hidden sm:h-[34rem] lg:h-[38rem]">
        {/* Poster keeps a real photograph on screen until the video's first frame loads. */}
        <video
          className="absolute inset-0 size-full object-cover"
          src="/videos/hero-background.mp4"
          poster="/images/products/family-fixed-wing.jpg"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      <div className="relative mx-auto -mt-32 max-w-6xl px-4 pb-14 sm:-mt-48 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <div className="animate-fade-up rounded-2xl bg-white p-6 shadow-[0_24px_60px_-30px_rgba(11,13,18,0.45)] sm:p-10">
            <Eyebrow>Zambia &middot; Africa</Eyebrow>
            <h1 className="mt-5 font-display text-[2rem] leading-[1.1] font-light tracking-[-0.02em] text-balance text-brand-black sm:text-5xl">
              Advanced Aerial Solutions &amp; Unmanned Aerial Vehicles Manufacturer
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-600">
              Providing cutting-edge UAV technology, site preparation equipment, and autonomous
              surveillance operations tailored across Zambia and Africa.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={returning ? "/login" : "/signup"}
                className="group inline-flex items-center gap-2 rounded-md bg-brand-blue px-6 py-3 text-xs font-semibold tracking-[0.12em] text-white uppercase transition-colors hover:bg-brand-blue-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
              >
                {returning ? "Log In to Portal" : "Sign Up — Nkem Portal"}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-6 py-3 text-xs font-semibold tracking-[0.12em] text-brand-black uppercase transition-colors hover:border-brand-blue hover:text-brand-blue"
              >
                View Products
              </Link>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-3 text-xs font-semibold tracking-[0.12em] text-brand-black uppercase hover:text-brand-blue"
              >
                <MessageCircle className="size-4" />
                WhatsApp
              </a>
            </div>
          </div>

          <ul className="grid grid-cols-3 gap-3 lg:grid-cols-1">
            {STRIP.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="group relative flex h-24 items-end overflow-hidden rounded-xl border-2 border-white bg-white shadow-md sm:h-28 lg:h-[5.6rem]"
                >
                  <Image src={s.image} alt="" fill sizes="(max-width: 1024px) 33vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="relative m-2 rounded-md bg-white/95 px-2 py-1 text-[10px] font-semibold tracking-[0.08em] text-brand-black uppercase sm:text-[11px]">
                    {s.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
