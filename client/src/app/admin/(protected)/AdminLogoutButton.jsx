"use client";

import { useRouter } from "next/navigation";
import { clearAdminToken } from "@/lib/api";

export function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    clearAdminToken();
    router.push("/admin/login");
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="text-sm font-medium text-muted-foreground hover:text-foreground"
    >
      Sign out
    </button>
  );
}
