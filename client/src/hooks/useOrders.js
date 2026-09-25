import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export function useMyOrders(options = {}) {
  return useQuery({
    queryKey: ["orders", "mine"],
    queryFn: () => apiRequest("/orders/mine", { auth: true }),
    ...options,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => apiRequest("/orders", { method: "POST", body: data, auth: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders", "mine"] }),
  });
}

export function useAdminOrders() {
  return useQuery({
    queryKey: ["admin", "orders"],
    queryFn: () => apiRequest("/orders", { admin: true }),
  });
}

export function useCreateAdminOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => apiRequest("/orders/admin", { method: "POST", body: data, admin: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "orders"] }),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => apiRequest(`/orders/${id}/status`, { method: "PATCH", body: { status }, admin: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "orders"] }),
  });
}

export function useRecordPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => apiRequest(`/orders/${id}/payments`, { method: "POST", body: data, admin: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "orders"] }),
  });
}

export function useReceipt(orderId, options = {}) {
  return useQuery({
    queryKey: ["orders", orderId, "receipt"],
    queryFn: () => apiRequest(`/orders/${orderId}/receipt`, { auth: true }),
    enabled: !!orderId,
    ...options,
  });
}
