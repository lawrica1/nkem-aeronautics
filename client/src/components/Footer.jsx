import Image from "next/image";
import { BrandMark } from "@/components/BrandMark";

export function Footer() {
  return (
    <footer className="relative mt-auto flex min-h-screen flex-col overflow-hidden border-t border-white/10 bg-brand-navy text-white">
      <div className="m-auto w-full max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <Image
                src="/images/logo.png"
                alt="Nkem Aeronautics"
                width={32}
                height={32}
                className="size-8 shrink-0 rounded-full"
              />
              <p className="font-semibold text-brand-gold">NKEM AERONAUTICS LTD</p>
            </div>
            <p className="mt-3 text-sm text-brand-footer-text">
              Leading aerial technological solutions for agriculture, land preparation, and
              autonomous surveillance across Africa.
            </p>
          </div>
          <div>
            <p className="font-semibold text-brand-gold">Headquarters &amp; Address</p>
            <p className="mt-3 text-sm text-brand-footer-text">
              Junction of Cairo Road and Independence Avenue, Lusaka 10101, Zambia
            </p>
            <p className="mt-3 text-sm text-brand-footer-text">Website: nkemaeronautics.com</p>
          </div>
          <div>
            <p className="font-semibold text-brand-gold">Contact Us</p>
            <p className="mt-3 text-sm text-brand-footer-text">Email: nkem@aeronautics.com</p>
            <p className="text-sm text-brand-footer-text">Tel / WhatsApp: +237 670 439 117</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-brand-footer-text/70">
        &copy; {new Date().getFullYear()} Nkem Aeronautics LTD. All rights reserved.
      </div>
      <BrandMark className="absolute right-6 bottom-16 hidden sm:flex" />
    </footer>
  );
}
