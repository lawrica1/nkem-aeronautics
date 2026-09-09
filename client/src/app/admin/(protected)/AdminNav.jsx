"use client";

import { useEffect, useState } from "react";
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
  BarChart3,
} from "lucide-react";
import { AdminLogoutButton } from "./AdminLogoutButton";

const NAV_LINKS = [
  { href: "/admin/requests", label: "Requests", icon: ClipboardList },
  { href: "/admin/pilots", label: "Pilots", icon: UserCheck },
  { href: "/admin/drones", label: "Drones", icon: Plane },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/part-requests", label: "Part Requests", icon: Wrench },
  { href: "/admin/quotes", label: "Quote Requests", icon: FileText },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/organizations", label: "Organizations", icon: Building2 },
  { href: "/admin/partners", label: "Partners", icon: Handshake },
  { href: "/admin/logbooks", label: "Logbooks", icon: BookOpen },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
];

export function AdminNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <header className="border-b border-border">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        {/* Desktop nav */}
        <div className="hidden flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium lg:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>{link.label}</Link>
          ))}
        </div>
        <div className="hidden lg:block">
          <AdminLogoutButton />
        </div>

        {/* Mobile controls */}
        <div className="flex w-full items-center justify-between lg:hidden">
          <p className="text-sm font-semibold text-brand-navy-dark">Admin</p>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="flex size-9 items-center justify-center rounded-lg border border-border text-brand-navy-dark"
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
              <p className="text-sm font-bold text-brand-navy-dark">Admin Panel</p>
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
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-brand-gray-light">
                      <link.icon className="size-4.5 text-brand-blue" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-border p-3">
              <AdminLogoutButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
