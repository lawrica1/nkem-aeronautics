import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export function useAssignOperation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => apiRequest("/operations", { method: "POST", body: data, admin: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "requests"] }),
  });
}

export function useUpdateOperation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) =>
      apiRequest(`/operations/${id}`, { method: "PATCH", body: data, admin: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "requests"] }),
  });
}

export function useAttachOperationMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, fileAssetIds }) =>
      apiRequest(`/operations/${id}/media`, { method: "POST", body: { fileAssetIds }, admin: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "requests"] }),
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ operationId, ...data }) =>
      apiRequest(`/operations/${operationId}/review`, { method: "POST", body: data, auth: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["farmer", "service-requests"] }),
  });
}
