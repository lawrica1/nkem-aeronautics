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
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[15px] font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-destructive"
    >
      <LogOut className="size-5" />
      Sign out
    </button>
  );
}
