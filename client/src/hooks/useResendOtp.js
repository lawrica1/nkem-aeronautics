import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export function useResendOtp() {
  return useMutation({
    mutationFn: ({ email }) =>
      apiRequest("/auth/resend-otp", { method: "POST", body: { email } }),
  });
}
