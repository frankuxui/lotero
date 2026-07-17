import { apiClient } from "@/lib/api/client";
import type { QueryParamValue } from "@/lib/api/client";
import type { ListSuggestionsQuery, Suggestion, SuggestionWithOutcome } from "@/types/suggestion";
import type { Paginated } from "@/types/api";

export function listTodaySuggestions(signal?: AbortSignal): Promise<Suggestion[]> {
  return apiClient.get<Suggestion[]>("/suggestions/today", { signal });
}

export function listSuggestions(query: ListSuggestionsQuery, signal?: AbortSignal): Promise<Paginated<SuggestionWithOutcome>> {
  return apiClient.getPaged<SuggestionWithOutcome>("/suggestions", { params: query as Record<string, QueryParamValue>, signal });
}
