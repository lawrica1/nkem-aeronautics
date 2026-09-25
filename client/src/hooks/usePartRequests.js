import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export function useMyPartRequests(options = {}) {
  return useQuery({
    queryKey: ["part-requests", "mine"],
    queryFn: () => apiRequest("/part-requests/mine", { auth: true }),
    ...options,
  });
}

export function useCreatePartRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => apiRequest("/part-requests", { method: "POST", body: data, auth: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["part-requests", "mine"] }),
  });
}

export function useAdminPartRequests() {
  return useQuery({
    queryKey: ["admin", "part-requests"],
    queryFn: () => apiRequest("/part-requests", { admin: true }),
  });
}

export function useUpdatePartRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => apiRequest(`/part-requests/${id}`, { method: "PATCH", body: data, admin: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "part-requests"] }),
  });
}
