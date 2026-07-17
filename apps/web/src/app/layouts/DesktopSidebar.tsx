import { Dices } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { primaryNavItems, secondaryNavItems, type NavItem } from "@/app/layouts/nav-items";
import ThemeToggle from "@/components/ThemeToggle";

function SidebarLink({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
        )
      }
    >
      <Icon className="size-4" aria-hidden="true" />
      {item.label}
    </NavLink>
  );
}

export function DesktopSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-16 items-center gap-2 px-6">
        <Dices className="size-6 text-indigo-600" aria-hidden="true" />
        <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">Lotero</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3 pb-6" aria-label="Navegación principal">
        {primaryNavItems.map((item) => (
          <SidebarLink key={item.to} item={item} />
        ))}
        <div className="my-3 h-px bg-slate-200 dark:bg-slate-800" />
        {secondaryNavItems.map((item) => (
          <SidebarLink key={item.to} item={item} />
        ))}
      </nav>
      <div className="flex items-center justify-between gap-2 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Tema</span>
        <ThemeToggle />
      </div>
    </aside>
  );
}
