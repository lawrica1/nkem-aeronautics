import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export function useIdCards() {
  return useQuery({
    queryKey: ["admin", "id-cards"],
    queryFn: () => apiRequest("/id-cards", { admin: true }),
  });
}

export function useCreateIdCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => apiRequest("/id-cards", { method: "POST", body: data, admin: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "id-cards"] }),
  });
}

export function useUpdateIdCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => apiRequest(`/id-cards/${id}`, { method: "PATCH", body: data, admin: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "id-cards"] }),
  });
}

export function useDeleteIdCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiRequest(`/id-cards/${id}`, { method: "DELETE", admin: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "id-cards"] }),
  });
}
