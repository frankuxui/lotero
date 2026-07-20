import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SkeletonCard({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2", className)} aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="w-full rounded-2xl bg-card p-6">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {Array.from({ length: 5 }).map((__, badgeIndex) => (
              <Skeleton key={badgeIndex} className="size-8 rounded-full" />
            ))}
          </div>
          <Skeleton className="mt-4 h-3 w-2/3" />
        </div>
      ))}
    </div>
  );
}
