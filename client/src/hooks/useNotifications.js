import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export function useNotifications(options = {}) {
  return useQuery({
    queryKey: ["notifications", "mine"],
    queryFn: () => apiRequest("/notifications/mine", { auth: true }),
    refetchInterval: 60 * 1000,
    ...options,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiRequest(`/notifications/${id}/read`, { method: "PATCH", auth: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications", "mine"] }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiRequest("/notifications/read-all", { method: "PATCH", auth: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications", "mine"] }),
  });
}
