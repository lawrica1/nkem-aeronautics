import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export function useAdminRequests({ purpose, country, ...options } = {}) {
  const params = new URLSearchParams();
  if (purpose) params.set("purpose", purpose);
  if (country) params.set("country", country);
  const query = params.toString();

  return useQuery({
    queryKey: ["admin", "requests", purpose, country],
    queryFn: () => apiRequest(`/requests${query ? `?${query}` : ""}`, { admin: true }),
    ...options,
  });
}
