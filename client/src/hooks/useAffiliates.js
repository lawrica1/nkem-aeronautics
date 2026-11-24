import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

const KEY = ["admin", "affiliates"];

export function useAffiliates() {
  return useQuery({ queryKey: KEY, queryFn: () => apiRequest("/affiliates", { admin: true }) });
}

function useAffiliateMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn, onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }) });
}

export const useCreateAffiliate = () =>
  useAffiliateMutation((data) => apiRequest("/affiliates", { method: "POST", body: data, admin: true }));

export const useUpdateAffiliate = () =>
  useAffiliateMutation(({ id, ...data }) => apiRequest(`/affiliates/${id}`, { method: "PATCH", body: data, admin: true }));

export const useDeleteAffiliate = () =>
  useAffiliateMutation((id) => apiRequest(`/affiliates/${id}`, { method: "DELETE", admin: true }));
