import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { SlidersHorizontal } from "lucide-react";
import { NumberCombinationField } from "@/components/shared/number-selector/NumberCombinationField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { buildCompareFormSchema, type CompareFormValues } from "@/features/comparison/schemas/compare-form.schema";
import type { GameConfig } from "@/types/game";

export function CompareForm({
  config,
  defaultValues,
  onSubmit,
  isSubmitting,
}: {
  config: GameConfig;
  defaultValues?: Partial<CompareFormValues>;
  onSubmit: (values: CompareFormValues) => void;
  isSubmitting: boolean;
}) {
  const schema = useMemo(() => buildCompareFormSchema(config), [config]);

  const { control, register, handleSubmit, formState } = useForm<CompareFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      numbers: [],
      source: "draws",
      dateFrom: "",
      dateTo: "",
      minMatches: undefined,
      ...defaultValues,
    },
  });

  const submit = handleSubmit(onSubmit);

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      <Controller
        control={control}
        name="numbers"
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-1.5">
            <Label>Combinación a comparar</Label>
            <NumberCombinationField
              config={config}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              invalid={Boolean(fieldState.error)}
            />
            {fieldState.error && <p className="text-xs text-red-600 dark:text-red-400">{fieldState.error.message}</p>}
          </div>
        )}
      />

      <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
        <SlidersHorizontal className="size-4" aria-hidden="true" />
        Filtros de comparación
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="compare-source">Comparar contra</Label>
          <Select id="compare-source" {...register("source")}>
            <option value="draws">Sorteos</option>
            <option value="bets">Apuestas</option>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="compare-from">Desde</Label>
          <Input id="compare-from" type="date" {...register("dateFrom")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="compare-to">Hasta</Label>
          <Input id="compare-to" type="date" {...register("dateTo")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="compare-min">Coincidencias mínimas</Label>
          <Input
            id="compare-min"
            type="number"
            min={0}
            max={config.numbers.count}
            {...register("minMatches", { setValueAs: (value) => (value === "" ? undefined : Number(value)) })}
          />
        </div>
      </div>

      {formState.errors.numbers && (
        <p className="text-xs text-red-600 dark:text-red-400">{formState.errors.numbers.message}</p>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Comparando…" : "Comparar"}
        </Button>
      </div>
    </form>
  );
}
