import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToastStore } from "@/store/toastStore";

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-20 z-100 flex flex-col items-center gap-2 px-4 sm:bottom-4 sm:items-end"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((item) => (
        <div
          key={item.id}
          className={cn(
            "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border bg-white p-3 shadow-lg dark:bg-slate-900 dark:border-slate-800",
            item.variant === "success" && "border-emerald-200 dark:border-emerald-900/60",
            item.variant === "error" && "border-red-200 dark:border-red-900/60",
            (!item.variant || item.variant === "default") && "border-slate-200",
          )}
        >
          {item.variant === "success" && <CheckCircle2 className="size-5 shrink-0 text-emerald-600" aria-hidden="true" />}
          {item.variant === "error" && <XCircle className="size-5 shrink-0 text-red-600" aria-hidden="true" />}
          {(!item.variant || item.variant === "default") && (
            <Info className="size-5 shrink-0 text-slate-500" aria-hidden="true" />
          )}
          <div className="flex-1 text-sm">
            <p className="font-medium text-slate-900 dark:text-slate-100">{item.title}</p>
            {item.description && <p className="text-slate-500 dark:text-slate-400">{item.description}</p>}
          </div>
          <button
            type="button"
            onClick={() => dismiss(item.id)}
            aria-label="Cerrar notificación"
            className="text-slate-400 transition-colors hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
