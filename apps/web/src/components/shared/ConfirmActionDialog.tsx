import { useId } from "react";
import { FloatingPortal, autoUpdate, useDismiss, useFloating, useInteractions, useRole } from "@floating-ui/react";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/components/ui/button";

type ConfirmActionDialogProps = {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void | Promise<void>;
  onOpenChange: (_open: boolean) => void;
  confirmLabel?: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  progressCurrent?: number;
  progressTotal?: number;
  progressLabel?: string;
};

export function ConfirmActionDialog({
  open,
  title,
  message,
  onConfirm,
  onOpenChange,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  isConfirming = false,
  progressCurrent,
  progressTotal,
  progressLabel = "Progreso"
}: ConfirmActionDialogProps) {
  "use no memo";

  const titleId = useId();
  const descriptionId = useId();
  const total = progressTotal ?? 0;
  const current = progressCurrent ?? 0;
  const hasProgress = isConfirming && total > 0;
  const percent = hasProgress ? Math.max(0, Math.min(100, Math.round((current / total) * 100))) : 0;

  const { refs, context } = useFloating({
    open,
    onOpenChange,
    whileElementsMounted: autoUpdate
  });

  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "dialog" });
  const { getFloatingProps } = useInteractions([dismiss, role]);

  return (
    <FloatingPortal>
      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              onClick={() => {
                if (isConfirming) {
                  return;
                }
                onOpenChange(false);
              }}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                ref={(node) => refs.setFloating(node)}
                className="w-full max-w-md rounded-xl border border-border bg-background p-5 shadow-lg"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                {...getFloatingProps()}
              >
                <h3 id={titleId} className="text-lg font-semibold">
                  {title}
                </h3>

                <p id={descriptionId} className="mt-2 text-sm text-muted-foreground">
                  {message}
                </p>

                {hasProgress ? (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{progressLabel}</span>
                      <span>
                        {current}/{total} ({percent}%)
                      </span>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-foreground/10">
                      <motion.div className="h-full rounded-full bg-rose-600" initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 0.25, ease: "easeOut" }} />
                    </div>
                  </div>
                ) : null}

                <div className="mt-5 flex justify-end gap-2">
                  <Button type="button" className="border border-border bg-transparent text-foreground hover:bg-foreground/10" onClick={() => onOpenChange(false)} disabled={isConfirming}>
                    {cancelLabel}
                  </Button>

                  <Button type="button" className="bg-rose-600 text-white hover:bg-rose-700" onClick={() => void onConfirm()} disabled={isConfirming}>
                    {isConfirming ? "Procesando..." : confirmLabel}
                  </Button>
                </div>
              </motion.div>
            </div>
          </>
        ) : null}
      </AnimatePresence>
    </FloatingPortal>
  );
}
