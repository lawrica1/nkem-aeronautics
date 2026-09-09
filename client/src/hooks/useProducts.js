import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export function useProducts(sector, q, application, { enabled = true } = {}) {
  const params = new URLSearchParams();
  if (sector) params.set("sector", sector);
  if (q) params.set("q", q);
  if (application) params.set("application", application);
  const query = params.toString();

  return useQuery({
    queryKey: ["products", sector, q, application],
    queryFn: () => apiRequest(`/products${query ? `?${query}` : ""}`),
    enabled,
  });
}

export function useProductBySlug(slug) {
  return useQuery({
    queryKey: ["products", "slug", slug],
    queryFn: () => apiRequest(`/products/slug/${slug}`),
    enabled: !!slug,
  });
}

export function useAdminProducts() {
  return useQuery({
    queryKey: ["admin", "products"],
    queryFn: () => apiRequest("/products/admin", { admin: true }),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => apiRequest("/products", { method: "POST", body: data, admin: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => apiRequest(`/products/${id}`, { method: "PATCH", body: data, admin: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
