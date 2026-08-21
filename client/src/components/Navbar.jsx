"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getToken, hasAccount } from "@/lib/api";

export function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getToken());
    setIsReturning(hasAccount());
  }, [pathname]);

  return (
    <header className="bg-brand-navy text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Nkem Aeronautics"
            width={44}
            height={44}
            className="size-11 shrink-0 rounded-full"
          />
          <div>
            <p className="text-2xl font-bold tracking-tight">NKEM AERONAUTICS LTD</p>
            <p className="mt-1 text-sm italic text-brand-gold">
              "Where fate and human glory lead, we are always there."
            </p>
          </div>
        </Link>
        <ul className="flex items-center gap-8 text-sm font-medium">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/services">Services</Link>
          </li>
          <li>
            <Link href="/logbook">Logbook Portal</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
          <li>
            {isLoggedIn ? (
              <Link href="/logbook">My Dashboard</Link>
            ) : isReturning ? (
              <Link href="/login">Log In</Link>
            ) : (
              <Link href="/signup">Sign Up</Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
