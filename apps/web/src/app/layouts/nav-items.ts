import { BarChart3, CalendarDays, GitCompare, Hash, History, Home, Settings, Ticket, type LucideIcon } from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

export const primaryNavItems: NavItem[] = [
  { to: "/", label: "Inicio", icon: Home, end: true },
  { to: "/bets", label: "Mis apuestas", icon: Ticket },
  { to: "/draws", label: "Sorteos", icon: CalendarDays },
  { to: "/compare", label: "Comparador", icon: GitCompare },
  { to: "/statistics", label: "Estadísticas", icon: BarChart3 },
];

export const secondaryNavItems: NavItem[] = [
  { to: "/history", label: "Historial", icon: History },
  { to: "/numbers", label: "Buscador de números", icon: Hash },
  { to: "/settings", label: "Configuración", icon: Settings },
];
