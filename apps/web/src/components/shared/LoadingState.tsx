import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoadingState({ label = "Cargando…", className }: { label?: string; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-16 text-slate-500", className)} role="status">
      <Loader2 className="size-6 animate-spin motion-reduce:animate-none" aria-hidden="true" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
