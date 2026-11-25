"use client";

import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

// Shared by the dashboard page and the sidebar's "needs attention" badges (one cached fetch).
export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => apiRequest("/admin/dashboard", { admin: true }),
  });
}
