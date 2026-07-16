import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { ExtraFieldControl } from "@/components/shared/number-selector/ExtraFieldControl";
import { NumberCombinationField } from "@/components/shared/number-selector/NumberCombinationField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buildDrawFormSchema, type DrawFormValues } from "@/features/draws/schemas/draw-form.schema";
import type { ApiError } from "@/lib/api/client";
import { defaultExtrasFor } from "@/lib/validation/game-rules";
import type { CreateDrawInput } from "@/types/draw";
import type { GameConfig } from "@/types/game";

export function DrawForm({
  config,
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel,
  serverError,
}: {
  config: GameConfig;
  defaultValues?: DrawFormValues;
  onSubmit: (payload: Omit<CreateDrawInput, "game">) => void;
  isSubmitting: boolean;
  submitLabel: string;
  serverError?: ApiError | null;
}) {
  const schema = useMemo(() => buildDrawFormSchema(config), [config]);

  const { control, register, handleSubmit, formState, setError } = useForm<DrawFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? { drawDate: "", numbers: [], extras: defaultExtrasFor(config) },
  });

  useEffect(() => {
    if (!serverError) return;
    for (const issue of serverError.fieldIssues) {
      if (issue.path[0] === "drawDate") {
        setError("drawDate", { message: issue.message });
      }
    }
  }, [serverError, setError]);

  const submit = handleSubmit((values) => onSubmit(values));

  return (
    <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
      {serverError && (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
        >
          {serverError.message}
        </div>
      )}

      <div className="flex flex-col gap-1.5 sm:max-w-xs">
        <Label htmlFor="draw-date">Fecha de sorteo</Label>
        <Input id="draw-date" type="date" invalid={Boolean(formState.errors.drawDate)} {...register("drawDate")} />
        {formState.errors.drawDate && (
          <p className="text-xs text-red-600 dark:text-red-400">{formState.errors.drawDate.message}</p>
        )}
      </div>

      <Controller
        control={control}
        name="numbers"
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-1.5">
            <Label>Números</Label>
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

      {config.extras.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {config.extras.map((extra) => (
            <Controller
              key={extra.key}
              control={control}
              name={`extras.${extra.key}`}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`draw-${extra.key}`}>
                    {extra.label}
                    {!extra.required && <span className="ml-1 text-slate-400">(opcional)</span>}
                  </Label>
                  <ExtraFieldControl
                    id={`draw-${extra.key}`}
                    config={extra}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    invalid={Boolean(fieldState.error)}
                  />
                  {fieldState.error && (
                    <p className="text-xs text-red-600 dark:text-red-400">{fieldState.error.message}</p>
                  )}
                </div>
              )}
            />
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
