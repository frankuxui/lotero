import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listSuggestions } from "@/lib/api/suggestions.api";
import { queryKeys } from "@/lib/query/keys";
import type { ListSuggestionsQuery } from "@/types/suggestion";

export function useSuggestionsList(query: ListSuggestionsQuery) {
  return useQuery({
    queryKey: queryKeys.suggestions.list(query),
    queryFn: ({ signal }) => listSuggestions(query, signal),
    placeholderData: keepPreviousData,
  });
}
