import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export function useNews() {
  return useQuery({
    queryKey: ["news"],
    queryFn: () => apiRequest("/news"),
  });
}

export function useAdminNews() {
  return useQuery({
    queryKey: ["admin", "news"],
    queryFn: () => apiRequest("/news/admin", { admin: true }),
  });
}

export function useCreateNews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => apiRequest("/news", { method: "POST", body: data, admin: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "news"] });
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
}

export function useUpdateNews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => apiRequest(`/news/${id}`, { method: "PATCH", body: data, admin: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "news"] });
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
}
