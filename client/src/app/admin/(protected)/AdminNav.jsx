"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ClipboardList,
  UserCheck,
  Plane,
  Package,
  ShoppingCart,
  Wrench,
  FileText,
  Newspaper,
  Users,
  Building2,
  Handshake,
  BookOpen,
  BadgeCheck,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import { AdminLogoutButton } from "./AdminLogoutButton";

const NAV_GROUPS = [
  {
    title: "Operations",
    links: [
      { href: "/admin/requests", label: "Requests", icon: ClipboardList },
      { href: "/admin/pilots", label: "Pilots", icon: UserCheck },
      { href: "/admin/drones", label: "Drones", icon: Plane },
    ],
  },
  {
    title: "Commerce",
    links: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
      { href: "/admin/part-requests", label: "Part Requests", icon: Wrench },
      { href: "/admin/quotes", label: "Quote Requests", icon: FileText },
    ],
  },
  {
    title: "Logbooks",
    links: [
      { href: "/admin/logbook-verification", label: "Logbook Verification", icon: BadgeCheck },
      { href: "/admin/logbooks", label: "Logbooks", icon: BookOpen },
      { href: "/admin/reports", label: "Reports", icon: BarChart3 },
    ],
  },
  {
    title: "People",
    links: [
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/organizations", label: "Organizations", icon: Building2 },
      { href: "/admin/partners", label: "Partners", icon: Handshake },
    ],
  },
  {
    title: "Content",
    links: [{ href: "/admin/news", label: "News", icon: Newspaper }],
  },
];

const ALL_LINKS = NAV_GROUPS.flatMap((g) => g.links);

function Brand() {
  return (
    <Link href="/admin/logbooks" className="flex items-center gap-3 px-5 py-5">
      <Image src="/images/logo.png" alt="" width={36} height={36} className="size-9 rounded-full bg-white" />
      <div className="leading-tight">
        <p className="text-sm font-bold tracking-wide text-white">NKEM AERONAUTICS</p>
        <p className="text-xs text-white/50">Admin Panel</p>
      </div>
    </Link>
  );
}

function NavList({ pathname }) {
  return (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
      {NAV_GROUPS.map((group) => (
        <div key={group.title}>
          <p className="px-3 text-[11px] font-semibold tracking-widest text-white/40 uppercase">{group.title}</p>
          <ul className="mt-2 space-y-0.5 text-sm font-medium">
            {group.links.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                      active ? "bg-brand-blue text-white shadow-sm" : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <link.icon className="size-4 shrink-0" />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function SidebarBody({ pathname }) {
  return (
    <>
      <Brand />
      <NavList pathname={pathname} />
      <div className="space-y-1 border-t border-white/10 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white"
        >
          <ExternalLink className="size-4" />
          View website
        </Link>
        <AdminLogoutButton />
      </div>
    </>
  );
}

export function AdminNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const current = ALL_LINKS.find((l) => pathname.startsWith(l.href));

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Desktop sidebar — fixed, so it stays put while the page scrolls */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-brand-navy-dark lg:flex">
        <SidebarBody pathname={pathname} />
      </aside>

      {/* Top bar (content area) — current section on desktop, menu button on mobile */}
      <header className="sticky top-0 z-30 border-b border-border bg-white/90 backdrop-blur lg:pl-64">
        <div className="flex h-14 items-center gap-3 px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            className="flex size-9 items-center justify-center rounded-lg border border-border text-brand-navy-dark lg:hidden"
          >
            <Menu className="size-5" />
          </button>
          <p className="text-sm text-muted-foreground">
            Admin
            {current && (
              <>
                <span className="mx-2 text-border">/</span>
                <span className="font-medium text-brand-navy-dark">{current.label}</span>
              </>
            )}
          </p>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-full max-w-xs flex-col bg-brand-navy-dark shadow-xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute top-5 right-3 flex size-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10"
            >
              <X className="size-5" />
            </button>
            <SidebarBody pathname={pathname} />
          </div>
        </div>
      )}
    </>
  );
}
