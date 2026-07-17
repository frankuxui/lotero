import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  label: string;
  value: ReactNode;
  description?: string;
  icon?: ReactNode;
  className?: string;
}

export function StatisticCard({ label, value, description, icon, className }: Props) {
  return (
    <Card className={className}>
      <CardContent className="flex items-start flex-col justify-between gap-3">
        <div className="w-full flex items-center justify-between gap-6">
          <div className="flex-1 grid gap-0.5">
            <h3 className="text-xs font-semibold uppercase tracking-wide">{label}</h3>
            <p className="text-xs">{description}</p>
          </div>
          {icon && <div className="flex-none text-indigo-600 dark:text-indigo-400">{icon}</div>}
        </div>
        <div className="flex items-center justify-start gap-4 w-full">
          <div className="inline-flex flex-none text-lg font-semibold text-foreground">{value}</div>
          {description && <p className="flex-1 text-xs text-foreground/80">{description}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
