import type { ReactNode } from "react";
import type { BreadcrumbItem } from "@/components/shared/Breadcrumbs";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export function PageHeader({ title, description, breadcrumbs, actions }: { title: string; description?: string; breadcrumbs?: BreadcrumbItem[]; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3">
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          {description && <p className="mt-1">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
