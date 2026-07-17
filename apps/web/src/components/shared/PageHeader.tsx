import type { ReactNode } from "react";
import type { BreadcrumbItem } from "@/components/shared/Breadcrumbs";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, breadcrumbs, actions, icon, className }: Props) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start justify-start gap-4 flex-col">
          {icon && <div className="flex-none">{icon}</div>}
          <div className="flex-1 gap-1 grid w-full max-w-6xl">
            <h1 className="text-xl font-medium text-foreground">{title}</h1>
            {description && <p className="w-full max-w-lg text-base leading-6">{description}</p>}
          </div>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
