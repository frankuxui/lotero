import { useMutation } from "@tanstack/react-query";
import { compare } from "@/lib/api/comparison.api";
import type { ComparisonRequest } from "@/types/comparison";

export function useCompare() {
  return useMutation({
    mutationFn: (request: ComparisonRequest) => compare(request),
  });
}
