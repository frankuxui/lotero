import { useQuery } from "@tanstack/react-query";
import { listTodaySuggestions } from "@/lib/api/suggestions.api";
import { queryKeys } from "@/lib/query/keys";

/**
 * staleTime corto (5 min): la sugerencia de hoy solo cambia si se registra un sorteo nuevo
 * (lo que ya invalida esta key desde useDrawMutations), así que no hace falta revalidar más seguido.
 */
export function useTodaySuggestions() {
  return useQuery({
    queryKey: queryKeys.suggestions.today,
    queryFn: ({ signal }) => listTodaySuggestions(signal),
    staleTime: 5 * 60_000,
  });
}
