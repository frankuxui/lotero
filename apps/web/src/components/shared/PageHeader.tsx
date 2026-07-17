import type { ReactNode } from "react";
import type { BreadcrumbItem } from "@/components/shared/Breadcrumbs";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

interface Props {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  icon?: ReactNode;
}

export function PageHeader({ title, description, breadcrumbs, actions, icon }: Props) {
  return (
    <div className="mb-8 flex flex-col gap-3">
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-start gap-4">
          {icon && <div className="flex-none">{icon}</div>}
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            {description && <p className="text-sm sm:text-base w-full">{description}</p>}
          </div>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
