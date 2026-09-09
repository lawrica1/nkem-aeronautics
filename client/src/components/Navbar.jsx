"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Home, Wrench, BookOpen, Mail, Building2 } from "lucide-react";
import { getToken } from "@/lib/api";
import { NotificationBell } from "@/components/NotificationBell";

const SERVICE_LINKS = [
  { label: "Agricultural Drone Services", slug: "agricultural" },
  { label: "Wildlife & Surveillance", slug: "wildlife" },
  { label: "Real Estate & Property Survey", slug: "real-estate" },
  { label: "Pipeline & Infrastructure Inspection", slug: "pipeline" },
  { label: "Survey & Mapping", slug: "survey-mapping" },
  { label: "eVTOL & Heavy-Lift Operations", slug: "evtol" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getToken());
    setMobileOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const dashboardLink = isLoggedIn ? (
    <Link href="/logbook">My Dashboard</Link>
  ) : (
    <Link href="/about">Company</Link>
  );

  return (
    <header className="bg-brand-navy text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-6">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Nkem Aeronautics"
            width={44}
            height={44}
            className="size-9 shrink-0 rounded-full sm:size-11"
          />
          <div className="min-w-0">
            <p className="truncate text-base font-bold tracking-tight sm:text-2xl">NKEM AERONAUTICS LTD</p>
            <p className="mt-1 hidden text-sm italic text-white/60 sm:block">
              "Where fate and human glory lead, we are always there."
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 text-sm font-medium lg:flex">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li className="group relative">
            <Link href="/services">Services</Link>
            <ul className="invisible absolute top-full left-0 z-50 w-64 rounded-lg border border-white/10 bg-brand-navy py-2 opacity-0 shadow-lg transition-opacity group-hover:visible group-hover:opacity-100">
              {SERVICE_LINKS.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services#${service.slug}`}
                    className="block px-4 py-2 text-sm font-normal text-white/85 hover:bg-white/10 hover:text-white"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <Link href="/logbook">Logbook Portal</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
          {isLoggedIn && (
            <li>
              <NotificationBell />
            </li>
          )}
          <li>{dashboardLink}</li>
        </ul>

        {/* Mobile controls */}
        <div className="flex items-center gap-3 lg:hidden">
          {isLoggedIn && <NotificationBell />}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/15 text-white"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-full max-w-xs flex-col overflow-y-auto bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <Image src="/images/logo.png" alt="Nkem Aeronautics" width={32} height={32} className="size-8 rounded-full" />
                <p className="text-sm font-bold text-brand-navy-dark">NKEM AERONAUTICS</p>
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="flex size-8 items-center justify-center rounded-lg text-brand-navy-dark hover:bg-brand-gray-light"
              >
                <X className="size-5" />
              </button>
            </div>

            <nav className="flex-1 p-3">
              <ul className="space-y-1 text-sm font-medium text-brand-navy-dark">
                <li>
                  <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-brand-gray-light">
                    <Home className="size-4.5 text-brand-blue" />
                    Home
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setMobileServicesOpen((v) => !v)}
                    className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-brand-gray-light"
                  >
                    <span className="flex items-center gap-3">
                      <Wrench className="size-4.5 text-brand-blue" />
                      Services
                    </span>
                    <ChevronDown className={`size-4 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`} />
                  </button>
                  {mobileServicesOpen && (
                    <ul className="mt-1 ml-8 space-y-1 border-l border-border pl-3">
                      {SERVICE_LINKS.map((service) => (
                        <li key={service.slug}>
                          <Link
                            href={`/services#${service.slug}`}
                            className="block rounded-md px-2 py-1.5 text-brand-navy-dark/75 hover:bg-brand-gray-light"
                          >
                            {service.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
                <li>
                  <Link href="/logbook" className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-brand-gray-light">
                    <BookOpen className="size-4.5 text-brand-blue" />
                    Logbook Portal
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-brand-gray-light">
                    <Mail className="size-4.5 text-brand-blue" />
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href={isLoggedIn ? "/logbook" : "/about"}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-brand-gray-light"
                  >
                    <Building2 className="size-4.5 text-brand-blue" />
                    {isLoggedIn ? "My Dashboard" : "Company"}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
