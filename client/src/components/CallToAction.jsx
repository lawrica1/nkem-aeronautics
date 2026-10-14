import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";

// Closing call-to-action card shared by the home and services pages.
export function CallToAction({
  title = "Ready to put drones to work on your land?",
  text = "Register your account today and start requesting drone services through your personal portal.",
  image = "/images/hero/hero-crop-spray.jpg",
}) {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-20">
      <Reveal className="clip-notch relative isolate mx-auto flex min-h-80 w-full max-w-6xl items-center overflow-hidden rounded-3xl bg-brand-black px-6 py-16 text-white sm:px-14">
        <Image src={image} alt="" fill sizes="(max-width: 1200px) 100vw, 1152px" className="-z-20 object-cover opacity-50" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-black via-brand-black/80 to-brand-black/20" />
        <div className="max-w-xl">
          <h2 className="font-display text-2xl leading-snug font-light tracking-[-0.02em] text-balance sm:text-4xl">{title}</h2>
          <p className="mt-4 text-sm leading-relaxed text-white/75 sm:text-base">{text}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-md bg-brand-blue px-6 py-3 text-xs font-semibold tracking-[0.12em] text-white uppercase transition-colors hover:bg-brand-blue-dark"
            >
              Create Your Account
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3 text-xs font-semibold tracking-[0.12em] text-white uppercase transition-colors hover:bg-white/10"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
