import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export function useOperationTelemetry(operationId, options = {}) {
  return useQuery({
    queryKey: ["telemetry", "operation", operationId],
    queryFn: () => apiRequest(`/telemetry/operation/${operationId}`, { auth: true }),
    enabled: !!operationId,
    ...options,
  });
}

export function useLogTelemetry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => apiRequest("/telemetry", { method: "POST", body: data, admin: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "requests"] }),
  });
}
