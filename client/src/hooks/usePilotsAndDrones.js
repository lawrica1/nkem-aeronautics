import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export function usePilots() {
  return useQuery({
    queryKey: ["admin", "pilots"],
    queryFn: () => apiRequest("/pilots", { admin: true }),
  });
}

export function useCreatePilot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => apiRequest("/pilots", { method: "POST", body: data, admin: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "pilots"] }),
  });
}

export function useUpdatePilot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => apiRequest(`/pilots/${id}`, { method: "PATCH", body: data, admin: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "pilots"] }),
  });
}

export function useDrones() {
  return useQuery({
    queryKey: ["admin", "drones"],
    queryFn: () => apiRequest("/drones", { admin: true }),
  });
}

export function useCreateDrone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => apiRequest("/drones", { method: "POST", body: data, admin: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "drones"] }),
  });
}

export function useUpdateDrone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => apiRequest(`/drones/${id}`, { method: "PATCH", body: data, admin: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "drones"] }),
  });
}
