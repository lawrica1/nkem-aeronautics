"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/api";

export function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await signOut({ admin: true });
    router.push("/admin/login");
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white"
    >
      <LogOut className="size-4" />
      Sign out
    </button>
  );
}
