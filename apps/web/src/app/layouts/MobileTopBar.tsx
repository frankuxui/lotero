import { useState } from "react";
import { Dices } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { primaryNavItems, secondaryNavItems } from "@/app/layouts/nav-items";
import ThemeToggle from "@/components/ThemeToggle";
import { Close } from "@/components/ui/close";

export function MobileTopBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-20 px-8 items-center justify-between border-b bg-background/80 backdrop-blur lg:hidden border-border">
      <div className="flex items-center gap-2">
        <Dices className="size-6 text-indigo-600" aria-hidden="true" />
        <span className="font-semibold text-lg text-foreground">Lotero</span>
      </div>
      <div className="inline-flex items-center justify-end gap-2">
        <ThemeToggle />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              aria-label="Abrir menú"
              className="rounded-full inline-flex flex-none items-center justify-center size-12 hover:bg-foreground/5 motion-safe:transition-all motion-safe:duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="size-12" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M9.41 9.66H9.4m5.2 0h-.01m-5.28 4.7H9.3m5.3 0h-.01"></path>
              </svg>
            </button>
          </SheetTrigger>
          <SheetContent open={open} side="right" closeButton={false}>
            <SheetHeader className="h-20 border-b border-border py-0 px-8 flex items-center justify-between">
              <SheetTitle className="p-0">Menú</SheetTitle>
              <Close onClick={() => setOpen(false)} />
            </SheetHeader>
            <nav className="flex flex-col px-4" aria-label="Navegación">
              {[...primaryNavItems, ...secondaryNavItems].map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-6 rounded-md px-4 py-3 text-sm font-medium transition-colors",
                        isActive ? "bg-indigo-500/20 text-indigo-500  dark:text-indigo-400" : "text-foreground/60 hover:bg-foreground/5"
                      )
                    }
                  >
                    <Icon className="size-5" aria-hidden="true" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
