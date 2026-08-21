import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { verifyToken, ADMIN_COOKIE } from "@/lib/server/auth";
import { AdminLogoutButton } from "./AdminLogoutButton";

async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return null;

  try {
    const payload = verifyToken(token);
    return payload.aud === "admin" ? payload : null;
  } catch {
    return null;
  }
}

export default async function AdminProtectedLayout({ children }) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
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
  );
}
