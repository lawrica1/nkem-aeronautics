"use client";

import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export function useAdminStats(options = {}) {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => apiRequest("/admin/stats", { admin: true }),
    ...options,
  });
}
