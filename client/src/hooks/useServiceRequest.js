import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export function useServiceRequest() {
  return useMutation({
    mutationFn: (request) =>
      apiRequest("/farmers/service-requests", { method: "POST", body: request, auth: true }),
  });
}
