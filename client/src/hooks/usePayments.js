import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export function useStartCheckout() {
  return useMutation({
    mutationFn: (orderId) => apiRequest(`/payments/orders/${orderId}/checkout`, { method: "POST", auth: true }),
  });
}

export function useConfirmPayment(transactionId, options = {}) {
  return useQuery({
    queryKey: ["payments", "confirm", transactionId],
    queryFn: () => apiRequest(`/payments/confirm?transaction_id=${transactionId}`, { auth: true }),
    enabled: !!transactionId,
    retry: false,
    ...options,
  });
}
