import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBet, deleteBet, updateBet } from "@/lib/api/bets.api";
import { queryKeys } from "@/lib/query/keys";
import type { CreateBetInput, UpdateBetInput } from "@/types/bet";

export function useCreateBet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBetInput) => createBet(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.bets.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.numbers.all });
    },
  });
}

export function useUpdateBet(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateBetInput) => updateBet(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.bets.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.bets.detail(id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.numbers.all });
    },
  });
}

export function useDeleteBet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBet(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.bets.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.numbers.all });
    },
  });
}
