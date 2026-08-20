import { useMutation } from "@tanstack/react-query";
import { apiRequest, setToken } from "@/lib/api";

export function useSignup() {
  return useMutation({
    mutationFn: (farmer) => apiRequest("/auth/signup", { method: "POST", body: farmer }),
    onSuccess: (data) => {
      if (data?.token) setToken(data.token);
    },
  });
}
