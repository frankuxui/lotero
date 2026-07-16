import { useState, type ReactNode } from "react";
import { FilterX, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileSheet } from "@/components/shared/MobileSheet";

export function FilterBar({
  children,
  hasActiveFilters = false,
  onClearFilters,
}: {
  children: ReactNode;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const showClear = hasActiveFilters && Boolean(onClearFilters);

  return (
    <div className="mb-4 w-full">
      <div className="w-full max-w-full hidden md:block">
        <div className="grid grid-cols-3 gap-4">{children}</div>
        {showClear && (
          <div className="mt-3 flex justify-end">
            <Button type="button" variant="ghost" size="sm" onClick={onClearFilters}>
              <FilterX aria-hidden="true" />
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>
      <div className="sm:hidden w-full max-w-full">
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
            <SlidersHorizontal aria-hidden="true" />
            Filtros
          </Button>
          {showClear && (
            <Button type="button" variant="ghost" size="sm" onClick={onClearFilters}>
              <FilterX aria-hidden="true" />
              Limpiar
            </Button>
          )}
        </div>

        <MobileSheet open={open} onOpenChange={setOpen} title="Filtros">
          <div className="flex flex-col gap-3 w-full">
            {children}
            {showClear && (
              <Button type="button" variant="outline" size="sm" onClick={onClearFilters}>
                <FilterX aria-hidden="true" />
                Limpiar filtros
              </Button>
            )}
          </div>
        </MobileSheet>
      </div>
    </div>
  );
}
