import { useMutation } from "@tanstack/react-query";
import { apiRequest, setToken, markHasAccount } from "@/lib/api";

export function useVerifyOtp() {
  return useMutation({
    mutationFn: ({ channel, contact, otp }) =>
      apiRequest("/auth/verify-otp", { method: "POST", body: { channel, contact, otp } }),
    onSuccess: (data) => {
      if (data?.token) setToken(data.token);
      markHasAccount();
    },
  });
}
