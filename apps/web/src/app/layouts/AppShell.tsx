import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { DesktopSidebar } from "@/app/layouts/DesktopSidebar";
import { MobileBottomNavigation } from "@/app/layouts/MobileBottomNavigation";
import { MobileTopBar } from "@/app/layouts/MobileTopBar";
import { LoadingState } from "@/components/shared/LoadingState";
import { Toaster } from "@/components/shared/Toaster";

export function AppShell() {
  return (
    <div className="flex min-h-dvh">
      <DesktopSidebar />
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <MobileTopBar />
        <main className="flex-1 px-8 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-6">
          {/*
            El Suspense debe vivir aquí, alrededor del Outlet, y no envolviendo todo el
            <Routes> (incluyendo este AppShell). Si envuelve el AppShell, cada navegación a
            una ruta lazy todavía no cargada desmonta el shell completo (Toaster, nav, sidebar)
            mientras se descarga el chunk, ocultando toasts recién disparados. En redes lentas
            (el caso típico de un móvil real) esa ventana es lo bastante larga para que el
            usuario nunca vea el toast de éxito, aunque el shell sí exista técnicamente después.
          */}
          <Suspense fallback={<LoadingState label="Cargando página…" />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      <MobileBottomNavigation />
      <Toaster />
    </div>
  );
}
