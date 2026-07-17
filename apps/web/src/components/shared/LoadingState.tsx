import { cn } from "@/lib/utils";
import { Spinner } from "../ui";

export function LoadingState({ label = "Cargando…", className }: { label?: string; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-16", className)} role="status">
      <Spinner size="2xl" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
