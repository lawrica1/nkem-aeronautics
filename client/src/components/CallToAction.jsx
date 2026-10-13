import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";

// Closing call-to-action band shared by the home and services pages.
export function CallToAction({
  title = "Ready to put drones to work on your land?",
  text = "Register your account today and start requesting drone services through your personal portal.",
  image = "/images/hero/hero-crop-spray.jpg",
}) {
  return (
    <section className="bg-white px-6 py-16 sm:py-20">
      <Reveal className="relative isolate mx-auto w-full max-w-6xl overflow-hidden rounded-3xl bg-brand-navy-dark px-6 py-14 text-white sm:px-12 sm:py-16">
        <Image src={image} alt="" fill sizes="(max-width: 1200px) 100vw, 1152px" className="-z-20 object-cover opacity-40" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-navy-dark via-brand-navy-dark/85 to-brand-navy-dark/30" />
        <div className="max-w-xl">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
          <p className="mt-4 leading-relaxed text-white/75">{text}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-full bg-brand-blue px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue-dark"
            >
              Create Your Account
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
