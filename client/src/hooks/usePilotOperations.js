import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export function useMyPilotOperations(options = {}) {
  return useQuery({
    queryKey: ["pilot", "operations"],
    queryFn: () => apiRequest("/operations/mine", { auth: true }),
    ...options,
  });
}

export function useUpdatePilotOperation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) =>
      apiRequest(`/operations/${id}/pilot-update`, { method: "PATCH", body: data, auth: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pilot", "operations"] }),
  });
}

export function useAttachPilotOperationMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, fileAssetIds }) =>
      apiRequest(`/operations/${id}/media`, { method: "POST", body: { fileAssetIds }, auth: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pilot", "operations"] }),
  });
}
