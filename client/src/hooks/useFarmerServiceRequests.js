import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export function useFarmerServiceRequests(options = {}) {
  return useQuery({
    queryKey: ["farmer", "service-requests"],
    queryFn: () => apiRequest("/farmers/service-requests", { auth: true }),
    staleTime: 30 * 1000,
    ...options,
  });
}
