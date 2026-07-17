import { useQuery } from "@tanstack/react-query";
import { compare } from "@/lib/api/comparison.api";
import { queryKeys } from "@/lib/query/keys";
import type { ComparisonRequest } from "@/types/comparison";

export function useComparisonResult(request: ComparisonRequest, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.comparison.result(request),
    queryFn: ({ signal }) => compare(request, signal),
    enabled: options?.enabled ?? true,
  });
}
