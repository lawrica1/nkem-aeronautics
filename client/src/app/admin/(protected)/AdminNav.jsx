"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PanelLeft,
  X,
  ChevronRight,
  ClipboardList,
  ShoppingCart,
  BookOpen,
  Users,
  Newspaper,
  ExternalLink,
  Plane,
} from "lucide-react";
import { AdminLogoutButton } from "./AdminLogoutButton";

// Collapsible groups keep the sidebar short enough to fit without a scrollbar.
const NAV_GROUPS = [
  {
    title: "Operations",
    icon: ClipboardList,
    links: [
      { href: "/admin/requests", label: "Requests" },
      { href: "/admin/pilots", label: "Pilots" },
    ],
  },
  { title: "Drones", icon: Plane, href: "/admin/drones" },
  {
    title: "Commerce",
    icon: ShoppingCart,
    links: [
      { href: "/admin/products", label: "Products" },
      { href: "/admin/orders", label: "Orders" },
      { href: "/admin/part-requests", label: "Part Requests" },
      { href: "/admin/quotes", label: "Quote Requests" },
    ],
  },
  {
    title: "Logbooks",
    icon: BookOpen,
    links: [
      { href: "/admin/logbook-verification", label: "Logbook Verification" },
      { href: "/admin/logbooks", label: "Logbooks" },
      { href: "/admin/reports", label: "Reports" },
    ],
  },
  {
    title: "People",
    icon: Users,
    links: [
      { href: "/admin/users", label: "Users" },
      { href: "/admin/organizations", label: "Organizations" },
      { href: "/admin/partners", label: "Partners" },
    ],
  },
  {
    title: "Content",
    icon: Newspaper,
    links: [{ href: "/admin/news", label: "News" }],
  },
];

const ALL_LINKS = NAV_GROUPS.flatMap((g) => g.links ?? [{ href: g.href, label: g.title }]);
const groupOf = (pathname) => NAV_GROUPS.find((g) => g.links?.some((l) => pathname.startsWith(l.href)))?.title;

const ROW = "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[15px] font-medium transition-colors";

function Brand() {
  return (
    <Link href="/admin/logbooks" className="flex items-center gap-3 px-5 py-5">
      <Image src="/images/logo.png" alt="" width={32} height={32} className="size-8 rounded-full" />
      <p className="text-base font-bold text-brand-navy-dark">Nkem Aeronautics</p>
    </Link>
  );
}

function NavList({ pathname }) {
  const [open, setOpen] = useState(() => new Set([groupOf(pathname)]));

  // Navigating into a collapsed group opens it, so the active page is always visible.
  useEffect(() => {
    const active = groupOf(pathname);
    if (active) setOpen((prev) => (prev.has(active) ? prev : new Set(prev).add(active)));
  }, [pathname]);

  function toggle(title) {
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(title) ? next.delete(title) : next.add(title);
      return next;
    });
  }

  return (
    <nav className="flex-1 overflow-y-auto px-3 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <p className="px-3 pb-2 text-sm font-semibold text-slate-500">Admin</p>
      <ul className="space-y-1">
        {NAV_GROUPS.map((group) => {
          if (group.href) {
            const active = pathname.startsWith(group.href);
            return (
              <li key={group.title}>
                <Link
                  href={group.href}
                  aria-current={active ? "page" : undefined}
                  className={`${ROW} ${
                    active ? "bg-brand-blue/10 font-semibold text-brand-blue" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <group.icon className="size-5 shrink-0" />
                  {group.title}
                </Link>
              </li>
            );
          }
          const isOpen = open.has(group.title);
          const hasActive = group.title === groupOf(pathname);
          return (
            <li key={group.title}>
              <button
                type="button"
                onClick={() => toggle(group.title)}
                aria-expanded={isOpen}
                className={`${ROW} ${hasActive ? "text-brand-navy-dark" : "text-slate-600"} hover:bg-slate-100`}
              >
                <group.icon className="size-5 shrink-0" />
                <span className="flex-1 text-left">{group.title}</span>
                <ChevronRight className={`size-4 text-slate-400 transition-transform ${isOpen ? "rotate-90" : ""}`} />
              </button>

              {isOpen && (
                <ul className="mt-1 mb-2 ml-5 space-y-0.5 border-l border-slate-200 pl-3">
                  {group.links.map((link) => {
                    const active = pathname.startsWith(link.href);
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          aria-current={active ? "page" : undefined}
                          className={`block rounded-lg px-3 py-1.5 text-[15px] transition-colors ${
                            active
                              ? "bg-brand-blue/10 font-semibold text-brand-blue"
                              : "text-slate-600 hover:bg-slate-100 hover:text-brand-navy-dark"
                          }`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function SidebarBody({ pathname }) {
  return (
    <>
      <Brand />
      <NavList pathname={pathname} />
      <div className="space-y-1 border-t border-slate-200 p-3">
        <Link href="/" target="_blank" className={`${ROW} text-slate-600 hover:bg-slate-100`}>
          <ExternalLink className="size-5" />
          View website
        </Link>
        <AdminLogoutButton />
      </div>
    </>
  );
}

const COLLAPSE_KEY = "nkem-admin-sidebar-collapsed";

// Owns the desktop collapse state so the content padding can follow the sidebar.
export function AdminShell({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  // Remembered per browser; storage can throw in private windows, so it is best-effort.
  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {}
  }, []);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      try {
        localStorage.setItem(COLLAPSE_KEY, prev ? "0" : "1");
      } catch {}
      return !prev;
    });
  }

  return (
    <>
      <AdminNav collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />
      <div className={`transition-[padding] duration-200 ${collapsed ? "" : "lg:pl-64"}`}>
        <main className="px-6 py-10 lg:px-10">{children}</main>
      </div>
    </>
  );
}

function AdminNav({ collapsed, onToggleCollapsed }) {
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
      <aside
        inert={collapsed || undefined}
        className={`fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:flex ${
          collapsed ? "-translate-x-full" : ""
        }`}
      >
        <SidebarBody pathname={pathname} />
      </aside>

      {/* Top bar (content area) — current section on desktop, menu button on mobile */}
      <header
        className={`sticky top-0 z-30 border-b border-border bg-white/90 backdrop-blur transition-[padding] duration-200 ${
          collapsed ? "" : "lg:pl-64"
        }`}
      >
        <div className="flex h-14 items-center gap-3 px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            className="flex size-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-brand-navy-dark lg:hidden"
          >
            <PanelLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? "Open sidebar" : "Close sidebar"}
            aria-expanded={!collapsed}
            title={collapsed ? "Open sidebar" : "Close sidebar"}
            className="hidden size-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-brand-navy-dark lg:flex"
          >
            <PanelLeft className="size-5" />
          </button>
          <span className="h-5 w-px bg-border" aria-hidden />
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
          <div className="absolute inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white shadow-xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute top-5 right-3 flex size-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
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
