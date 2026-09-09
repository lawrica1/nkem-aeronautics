import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export function usePartners() {
  return useQuery({
    queryKey: ["admin", "partners"],
    queryFn: () => apiRequest("/partners", { admin: true }),
  });
}

export function useCreatePartner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => apiRequest("/partners", { method: "POST", body: data, admin: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "partners"] }),
  });
}

export function useAssignPartner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, partnerId }) =>
      apiRequest(`/requests/${id}/partner`, { method: "PATCH", body: { partnerId }, admin: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "requests"] }),
  });
}

export function useMyPartnerRequests(options = {}) {
  return useQuery({
    queryKey: ["partner", "requests"],
    queryFn: () => apiRequest("/requests/partner/mine", { auth: true }),
    ...options,
  });
}
