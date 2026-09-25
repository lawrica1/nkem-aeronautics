import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export function useFarmerProfile(options = {}) {
  return useQuery({
    queryKey: ["farmer", "me"],
    queryFn: () => apiRequest("/farmers/me", { auth: true }),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    ...options,
  });
}
