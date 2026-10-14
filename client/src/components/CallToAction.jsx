import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";

// Closing call-to-action shared by the home, services and products pages:
// a wide photograph with a white card over its left side.
export function CallToAction({
  title = "Ready to put drones to work on your land?",
  text = "Register your account today and start requesting drone services through your personal portal.",
  image = "/images/hero/hero-crop-spray.jpg",
}) {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-20">
      <Reveal className="relative isolate mx-auto w-full max-w-6xl overflow-hidden rounded-3xl">
        <Image src={image} alt="" fill sizes="(max-width: 1200px) 100vw, 1152px" className="-z-10 object-cover" />
        <div className="p-4 sm:p-10 lg:py-16">
          <div className="max-w-lg rounded-2xl bg-white/95 p-6 shadow-[0_24px_60px_-30px_rgba(11,13,18,0.45)] backdrop-blur sm:p-9">
            <h2 className="font-display text-2xl leading-snug font-light tracking-[-0.02em] text-balance text-brand-black sm:text-3xl">
              {title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">{text}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 rounded-md bg-brand-blue px-6 py-3 text-xs font-semibold tracking-[0.12em] text-white uppercase transition-colors hover:bg-brand-blue-dark"
              >
                Create Your Account
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-6 py-3 text-xs font-semibold tracking-[0.12em] text-brand-black uppercase transition-colors hover:border-brand-blue hover:text-brand-blue"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
