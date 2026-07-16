import { Outlet } from "react-router-dom";
import { DesktopSidebar } from "@/app/layouts/DesktopSidebar";
import { MobileBottomNavigation } from "@/app/layouts/MobileBottomNavigation";
import { MobileTopBar } from "@/app/layouts/MobileTopBar";
import { Toaster } from "@/components/shared/Toaster";
import { useApplyTheme } from "@/hooks/useApplyTheme";

export function AppShell() {
  useApplyTheme();

  return (
    <div className="flex min-h-dvh">
      <DesktopSidebar />
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <MobileTopBar />
        <main className="flex-1 px-8 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-6">
          <Outlet />
        </main>
      </div>
      <MobileBottomNavigation />
      <Toaster />
    </div>
  );
}
