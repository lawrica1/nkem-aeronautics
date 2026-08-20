import { useQuery } from "@tanstack/react-query";
import { FIRM_OPTIONS } from "@/lib/firms";

// Returns the local placeholder list (see lib/firms.js) until a backend
// /firms endpoint exists — swap queryFn to `apiRequest("/firms")` then.
export function useFirms() {
  return useQuery({
    queryKey: ["firms"],
    queryFn: () => Promise.resolve(FIRM_OPTIONS),
    staleTime: Infinity,
  });
}
