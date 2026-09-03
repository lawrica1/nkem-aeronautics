import Link from "next/link";
import { AdminAuthGate } from "./AdminAuthGate";
import { AdminLogoutButton } from "./AdminLogoutButton";

export default function AdminProtectedLayout({ children }) {
  return (
    <AdminAuthGate>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-6 text-sm font-medium">
              <Link href="/admin/logbooks">Logbooks</Link>
              <Link href="/admin/reports">Reports</Link>
            </div>
            <AdminLogoutButton />
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
      </div>
    </AdminAuthGate>
  );
}
