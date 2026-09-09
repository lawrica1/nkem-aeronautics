import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export function useCreateQuote() {
  return useMutation({
    mutationFn: (data) => apiRequest("/quotes", { method: "POST", body: data }),
  });
}

export function useAdminQuotes() {
  return useQuery({
    queryKey: ["admin", "quotes"],
    queryFn: () => apiRequest("/quotes/admin", { admin: true }),
  });
}

export function useUpdateQuote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => apiRequest(`/quotes/${id}`, { method: "PATCH", body: data, admin: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "quotes"] });
    },
  });
}
