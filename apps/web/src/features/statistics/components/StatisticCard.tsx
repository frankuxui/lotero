import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

export function StatisticCard({ label, value, description, icon, className }: { label: string; value: ReactNode; description?: string; icon?: ReactNode; className?: string }) {
  return (
    <Card className={className}>
      <CardContent className="flex items-start justify-between gap-3 pt-4">
        <div className="w-full">
          <p className="text-xs font-medium uppercase tracking-wide">{label}</p>
          <div className="mt-1 w-full text-lg font-semibold text-foreground">{value}</div>
          {description && <p className="mt-1 text-xs text-foreground/80">{description}</p>}
        </div>
        {icon && <div className="text-indigo-600 dark:text-indigo-400">{icon}</div>}
      </CardContent>
    </Card>
  );
}
