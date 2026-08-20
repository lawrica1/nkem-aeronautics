import { useMutation } from "@tanstack/react-query";
import { apiRequest, setToken } from "@/lib/api";

export function useLogin() {
  return useMutation({
    mutationFn: (credentials) => apiRequest("/auth/login", { method: "POST", body: credentials }),
    onSuccess: (data) => {
      if (data?.token) setToken(data.token);
    },
  });
}
