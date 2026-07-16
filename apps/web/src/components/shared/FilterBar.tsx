import { useState, type ReactNode } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileSheet } from "@/components/shared/MobileSheet";

export function FilterBar({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4 w-full">
      <div className="w-full max-w-full hidden md:grid md:grid-cols-3 gap-4">{children}</div>
      <div className="sm:hidden w-full max-w-full">
        <Button type="button" variant="outline" onClick={() => setOpen(true)}>
          <SlidersHorizontal aria-hidden="true" />
          Filtros
        </Button>

        <MobileSheet open={open} onOpenChange={setOpen} title="Filtros">
          <div className="flex flex-col gap-3 w-full">{children}</div>
        </MobileSheet>
      </div>
    </div>
  );
}
