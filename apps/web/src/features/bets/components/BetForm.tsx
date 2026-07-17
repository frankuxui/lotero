import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { Copy, Plus, Trash2 } from "lucide-react";
import { z } from "zod";
import { ExtraFieldControl } from "@/components/shared/number-selector/ExtraFieldControl";
import { NumberCombinationField } from "@/components/shared/number-selector/NumberCombinationField";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buildBetFormSchema, type BetFormValues } from "@/features/bets/schemas/bet-form.schema";
import { useFormDraftPersistence } from "@/hooks/useFormDraftPersistence";
import type { ApiError } from "@/lib/api/client";
import { readValidFormDraft } from "@/lib/storage/formDraft";
import { defaultExtrasFor, randomValidCombination } from "@/lib/validation/game-rules";
import type { CreateBetInput } from "@/types/bet";
import type { GameConfig } from "@/types/game";

// Schema "de forma" (no el de negocio) para validar un borrador leído de sessionStorage: un
// borrador a medio rellenar no cumple `buildBetFormSchema` (números incompletos, extras
// obligatorios vacíos), así que solo se comprueba que la estructura general sea la esperada.
const betDraftShapeSchema = z.object({
  label: z.string().optional(),
  createdAt: z.string(),
  lines: z
    .array(
      z.object({
        numbers: z.array(z.number()),
        extras: z.record(z.string(), z.unknown())
      })
    )
    .min(1)
});

export function BetForm({
  config,
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel,
  serverError,
  onLabelChange,
  draftKey
}: {
  config: GameConfig;
  defaultValues?: BetFormValues;
  onSubmit: (payload: Omit<CreateBetInput, "game">) => void;
  isSubmitting: boolean;
  submitLabel: string;
  serverError?: ApiError | null;
  /** Notifica el valor en vivo de "Observaciones" en cada tecleo, para que la pantalla que
   * contiene el formulario (p. ej. el título de la página) pueda reflejarlo sin esperar a guardar. */
  onLabelChange?: (label: string) => void;
  /** Clave única (incluye modo nuevo/edición y, en edición, el id de la apuesta) para
   * persistir un borrador en sessionStorage mientras se escribe y recuperarlo si el
   * navegador móvil descarga la pestaña al minimizarla. Ver `lib/storage/formDraft.ts`. */
  draftKey: string;
}) {
  const schema = useMemo(() => buildBetFormSchema(config), [config]);

  // Se lee una sola vez, al montar: un borrador más reciente que `defaultValues` (que viene de
  // la API) debe ganar, porque es exactamente lo que el usuario estaba escribiendo cuando se
  // interrumpió. Si no hay borrador válido, se cae a `defaultValues` (edición) o al formulario
  // vacío (creación), igual que antes de este fix.
  const initialValues = useMemo<BetFormValues>(() => {
    const draft = readValidFormDraft(draftKey, betDraftShapeSchema);
    return (
      draft ??
      defaultValues ?? {
        label: "",
        createdAt: new Date().toISOString().slice(0, 10),
        lines: [{ numbers: [], extras: defaultExtrasFor(config) }]
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo debe calcularse en el montaje.
  }, []);

  const form = useForm<BetFormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialValues
  });

  const { control, register, handleSubmit, formState, setError } = form;
  const { fields, append, remove, insert } = useFieldArray({ control, name: "lines" });

  // useWatch (a diferencia de leer form.getValues() una vez) suscribe al componente a cada
  // cambio del campo y fuerza un re-render, que es lo que permite propagar el valor mientras
  // el usuario todavía está escribiendo, en vez de solo al perder foco o al enviar el formulario.
  const watchedLabel = useWatch({ control, name: "label" });

  useEffect(() => {
    onLabelChange?.(watchedLabel ?? "");
  }, [watchedLabel, onLabelChange]);

  useFormDraftPersistence({ storageKey: draftKey, control });

  useEffect(() => {
    if (!serverError) return;
    for (const issue of serverError.fieldIssues) {
      if (issue.path[0] === "label") {
        setError("label", { message: issue.message });
      }
      if (issue.path[0] === "createdAt") {
        setError("createdAt", { message: issue.message });
      }
    }
  }, [serverError, setError]);

  const submit = handleSubmit((values) => {
    onSubmit({
      label: values.label || undefined,
      createdAt: values.createdAt,
      lines: values.lines
    });
  });

  return (
    <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
      {serverError && (
        <div role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {serverError.message}
        </div>
      )}

      <div className="flex flex-col gap-1.5 sm:max-w-xs">
        <Label htmlFor="bet-created-at">Fecha de creación</Label>
        <Input id="bet-created-at" type="date" invalid={Boolean(formState.errors.createdAt)} {...register("createdAt")} />
        {formState.errors.createdAt && <p className="text-xs text-red-600 dark:text-red-400">{formState.errors.createdAt.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bet-label">Observaciones (opcional)</Label>
        <Input id="bet-label" invalid={Boolean(formState.errors.label)} placeholder="Ej. Apuesta de la peña" {...register("label")} />
        {formState.errors.label && <p className="text-xs text-red-600 dark:text-red-400">{formState.errors.label.message}</p>}
      </div>

      <div className="flex flex-col gap-4 w-full">
        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardContent className="flex flex-col gap-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Línea {index + 1}</h3>
                <div className="flex items-center gap-1">
                  <Button type="button" variant="ghost" size="icon" aria-label="Duplicar línea" onClick={() => insert(index + 1, form.getValues(`lines.${index}`))}>
                    <Copy className="size-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" aria-label="Eliminar línea" disabled={fields.length <= 1} onClick={() => remove(index)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>

              <Controller
                control={control}
                name={`lines.${index}.numbers`}
                render={({ field: numbersField, fieldState }) => (
                  <div className="flex flex-col gap-1.5">
                    <Label>Números</Label>
                    <NumberCombinationField config={config} value={numbersField.value} onChange={numbersField.onChange} onBlur={numbersField.onBlur} invalid={Boolean(fieldState.error)} />
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
                      name={`lines.${index}.extras.${extra.key}`}
                      render={({ field: extraField, fieldState }) => (
                        <div className="flex flex-col gap-1.5">
                          <Label htmlFor={`line-${index}-${extra.key}`}>
                            {extra.label}
                            {!extra.required && <span className="ml-1 text-slate-400">(opcional)</span>}
                          </Label>
                          <div className="w-full mt-4">
                            <ExtraFieldControl
                              id={`line-${index}-${extra.key}`}
                              config={extra}
                              value={extraField.value}
                              onChange={extraField.onChange}
                              onBlur={extraField.onBlur}
                              invalid={Boolean(fieldState.error)}
                            />
                          </div>
                          {fieldState.error && <p className="text-xs text-red-600 dark:text-red-400">{fieldState.error.message}</p>}
                        </div>
                      )}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={() => append({ numbers: randomValidCombination(config), extras: defaultExtrasFor(config) })}>
          <Plus aria-hidden="true" />
          Añadir línea
        </Button>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
