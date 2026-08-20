"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { hasAccount } from "@/lib/api";

const WHATSAPP_NUMBER = "237670439117";

export function Hero() {
  // Starts false to match the server render, then syncs after mount —
  // reading localStorage directly during render would mismatch SSR output.
  const [returning, setReturning] = useState(false);

  useEffect(() => {
    setReturning(hasAccount());
  }, []);

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-brand-navy px-6 py-24 text-white">
      {/* Real hero photo (crop-spraying aircraft) with a navy wash so white text stays legible. */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero/hero-crop-spray.jpg')" }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(15,39,64,0.75) 0%, rgba(15,39,64,0.45) 45%, rgba(15,39,64,0.2) 75%, rgba(15,39,64,0.1) 100%), linear-gradient(rgba(15,39,64,0.35), rgba(15,39,64,0.1) 25%, rgba(15,39,64,0.1) 75%, rgba(15,39,64,0.45))",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl -translate-y-16 sm:-translate-y-20">
        <p className="animate-fade-up mb-4 inline-block rounded-full border border-white/25 px-4 py-1 text-xs font-semibold tracking-widest text-white/70 uppercase">
          Zambia &middot; Sub-Saharan Africa
        </p>

        <div className="max-w-3xl border-l-4 border-brand-gold pl-6">
          <h1
            className="animate-fade-up text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            style={{ animationDelay: "100ms" }}
          >
            Advanced Aerial Solutions &amp;{" "}
            <span className="text-brand-gold">Agricultural Innovation</span>
          </h1>

          <div
            className="animate-fade-up mt-8 border-t border-white/15 pt-8"
            style={{ animationDelay: "200ms" }}
          >
            <p className="text-lg text-white/80">
              Providing cutting-edge UAV technology, site preparation equipment, and autonomous
              surveillance operations tailored across Zambia and Sub-Saharan Africa.
            </p>
          </div>

          <div
            className="animate-fade-up mt-8 flex flex-wrap gap-4"
            style={{ animationDelay: "300ms" }}
          >
            <Link
              href={returning ? "/login" : "/signup"}
              className={cn(
                buttonVariants(),
                "h-auto gap-2 rounded-full bg-brand-gold px-8 py-3 text-base font-semibold text-brand-navy-dark transition-transform hover:scale-105 hover:bg-brand-gold/90",
              )}
            >
              {returning ? "Log In to Portal" : "Sign Up — Nkem Aeronautics Portal"}
              <ArrowRight className="size-4" />
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-auto gap-2 rounded-full border-white/40 bg-transparent px-8 py-3 text-base font-semibold text-white transition-transform hover:scale-105 hover:bg-white/10 hover:text-white",
              )}
            >
              <MessageCircle className="size-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
