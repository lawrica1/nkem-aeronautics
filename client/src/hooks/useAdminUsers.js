import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export function useAdminUsers(filters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.role) params.set("role", filters.role);
  if (filters.sector) params.set("sector", filters.sector);
  if (filters.country) params.set("country", filters.country);
  const query = params.toString();

  return useQuery({
    queryKey: ["admin", "users", filters],
    queryFn: () => apiRequest(`/admin/users${query ? `?${query}` : ""}`, { admin: true }),
  });
}

export function useUpdateAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) =>
      apiRequest(`/admin/users/${id}`, { method: "PATCH", body: data, admin: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
}
