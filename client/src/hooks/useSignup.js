import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

// No token is stored here — the account isn't verified until the OTP step
// (see useVerifyOtp) succeeds, so a token issued at this point would be premature.
export function useSignup() {
  return useMutation({
    mutationFn: (farmer) => apiRequest("/auth/signup", { method: "POST", body: farmer }),
  });
}
