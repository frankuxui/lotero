import { Dices } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { primaryNavItems, secondaryNavItems, type NavItem } from "@/app/layouts/nav-items";
import ThemeToggle from "@/components/ThemeToggle";

function SidebarLink({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <NavLink to={item.to} end={item.end} className="w-full group">
      {({ isActive }) => (
        <div
          className={cn(
            "inline-flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium transition-colors",
            isActive ? "bg-foreground text-background" : "group-hover:bg-foreground/5 text-foreground"
          )}
        >
          <Icon className="size-4 " aria-hidden="true" />
          {item.label}
        </div>
      )}
    </NavLink>
  );
}

export function DesktopSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 shrink-0 flex-col border-r border-border bg-card lg:flex ">
      <div className="flex h-16 items-center gap-2 px-6 border-b border-border">
        <Dices className="size-6 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
        <span className="text-lg font-semibold text-foreground">Lotero</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3 pb-6 pt-10" aria-label="Navegación principal">
        {primaryNavItems.map((item) => (
          <SidebarLink key={item.to} item={item} />
        ))}
        <div className="my-3 h-px bg-border" />
        {secondaryNavItems.map((item) => (
          <SidebarLink key={item.to} item={item} />
        ))}
      </nav>
      <div className="flex items-center justify-between gap-2 border-t border-border px-6 py-4 ">
        <span className="text-sm font-medium ">Tema</span>
        <ThemeToggle />
      </div>
    </aside>
  );
}
