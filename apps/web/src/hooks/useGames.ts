import { useQuery } from "@tanstack/react-query";
import { listGames } from "@/lib/api/games.api";
import { queryKeys } from "@/lib/query/keys";

export function useGames() {
  return useQuery({
    queryKey: queryKeys.games.all,
    queryFn: ({ signal }) => listGames(signal),
    staleTime: Infinity,
  });
}
