import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDraw, deleteDraw, updateDraw } from "@/lib/api/draws.api";
import { queryKeys } from "@/lib/query/keys";
import type { CreateDrawInput, UpdateDrawInput } from "@/types/draw";

export function useCreateDraw() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateDrawInput) => createDraw(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.draws.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.statistics.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.numbers.all });
      // La API regenera la sugerencia del día del juego afectado al crear el sorteo;
      // invalidamos aquí para que el Dashboard y el histórico la recojan sin esperar el staleTime.
      void queryClient.invalidateQueries({ queryKey: queryKeys.suggestions.all });
    },
  });
}

export function useUpdateDraw(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateDrawInput) => updateDraw(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.draws.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.draws.detail(id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.statistics.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.numbers.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.suggestions.all });
    },
  });
}

export function useDeleteDraw() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDraw(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.draws.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.statistics.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.numbers.all });
      // Borrar un sorteo puede cambiar el resultado (acierto/pendiente) que el histórico de
      // sugerencias calcula al vuelo contra los sorteos reales; invalidamos por consistencia,
      // aunque el backend no regenera la sugerencia en sí al borrar.
      void queryClient.invalidateQueries({ queryKey: queryKeys.suggestions.all });
    },
  });
}
