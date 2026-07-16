import { lazy, Suspense, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { queryClient } from "@/lib/query/queryClient";

const ReactQueryDevtools = import.meta.env.DEV ? lazy(() => import("@tanstack/react-query-devtools").then((mod) => ({ default: mod.ReactQueryDevtools }))) : null;

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        {children}
        {ReactQueryDevtools && (
          <Suspense fallback={null}>
            <ReactQueryDevtools initialIsOpen={false} />
          </Suspense>
        )}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
