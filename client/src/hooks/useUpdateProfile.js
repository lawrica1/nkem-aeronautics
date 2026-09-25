import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => apiRequest("/farmers/me", { method: "PATCH", body: data, auth: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farmer", "me"] });
    },
  });
}
