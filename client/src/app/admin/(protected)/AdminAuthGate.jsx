"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminToken } from "@/lib/api";

export function AdminAuthGate({ children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getAdminToken()) {
      router.replace("/admin/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10 text-sm text-muted-foreground">
        Checking admin session...
      </div>
    );
  }

  return children;
}
