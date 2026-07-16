import { useState, type ReactNode } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function FilterBar({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4">
      <div className="hidden flex-wrap items-center gap-3 sm:flex">{children}</div>
      <div className="sm:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button type="button" variant="outline" size="sm">
              <SlidersHorizontal aria-hidden="true" />
              Filtros
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-3">{children}</div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
