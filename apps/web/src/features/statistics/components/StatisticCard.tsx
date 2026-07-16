import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

export function StatisticCard({
  label,
  value,
  description,
  icon,
  className,
}: {
  label: string;
  value: ReactNode;
  description?: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardContent className="flex items-start justify-between gap-3 pt-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-50">{value}</p>
          {description && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>}
        </div>
        {icon && <div className="text-indigo-600 dark:text-indigo-400">{icon}</div>}
      </CardContent>
    </Card>
  );
}
