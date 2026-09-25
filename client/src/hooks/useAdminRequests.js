import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export function useAdminRequests({ country, ...options } = {}) {
  const params = new URLSearchParams();
  if (country) params.set("country", country);
  const query = params.toString();

  return useQuery({
    queryKey: ["admin", "requests", country],
    queryFn: () => apiRequest(`/requests${query ? `?${query}` : ""}`, { admin: true }),
    ...options,
  });
}
