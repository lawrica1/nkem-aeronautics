import { useMutation } from "@tanstack/react-query";
import { apiRequest, setToken, markHasAccount } from "@/lib/api";

export function useVerifyOtp() {
  return useMutation({
    mutationFn: ({ email, otp }) =>
      apiRequest("/auth/verify-otp", { method: "POST", body: { email, otp } }),
    onSuccess: (data) => {
      if (data?.token) setToken(data.token);
      markHasAccount();
    },
  });
}
