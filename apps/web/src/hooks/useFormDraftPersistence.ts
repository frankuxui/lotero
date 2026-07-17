import { useEffect, useRef } from "react";
import type { Control, FieldValues } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { writeFormDraft } from "@/lib/storage/formDraft";

const DEBOUNCE_MS = 300;

/**
 * Guarda en sessionStorage, con un pequeño debounce, cada cambio del formulario mientras el
 * usuario escribe. Ver `lib/storage/formDraft.ts` para el porqué (sobrevivir a que el
 * navegador móvil descargue la pestaña al minimizarla, algo que ningún ajuste de refetch de
 * TanStack Query ni de reset de React Hook Form puede evitar).
 */
export function useFormDraftPersistence<T extends FieldValues>({
  storageKey,
  control,
  enabled = true,
}: {
  storageKey: string;
  control: Control<T>;
  enabled?: boolean;
}): void {
  const values = useWatch({ control });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      writeFormDraft(storageKey, values);
    }, DEBOUNCE_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `values` es un objeto nuevo en cada
    // tecleo por diseño de useWatch; comparar por referencia es exactamente lo que queremos aquí.
  }, [values, enabled, storageKey]);

  // Además del guardado periódico, escribe inmediatamente cuando la pestaña deja de estar
  // visible (minimizar, cambiar de app, bloquear pantalla): es el último momento garantizado
  // antes de que el sistema pueda descargar el proceso, así que no podemos esperar al debounce.
  useEffect(() => {
    if (!enabled) return;
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        writeFormDraft(storageKey, values);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [values, enabled, storageKey]);
}
