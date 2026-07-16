import * as React from "react";
import { useTheme } from "next-themes";

type ThemeMode = "light" | "dark" | "system";

function subscribe() {
  return () => {};
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
        d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"
      />
    </svg>
  );
}

function SystemIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="4" width="18" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" d="M8 20h8M12 16v4" />
    </svg>
  );
}

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isMounted = React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  const currentTheme: ThemeMode = (theme as ThemeMode | undefined) ?? "system";

  const handleTheme = () => {
    const next: ThemeMode = currentTheme === "dark" ? "light" : currentTheme === "light" ? "system" : "dark";
    setTheme(next);
  };

  if (!isMounted) {
    return <span className="inline-flex size-10" aria-hidden="true" />;
  }

  return (
    <button
      aria-label="Switch theme"
      type="button"
      className="group inline-flex size-10 items-center justify-center overflow-hidden rounded-full text-foreground backdrop-blur-md transition motion-safe:transition-colors motion-safe:duration-500 hover:bg-foreground/5 focus:bg-foreground/10"
      onClick={handleTheme}
    >
      <span aria-hidden="true" className="sr-only">
        Switch theme
      </span>
      <div className="relative h-8 w-8">
        <div
          className={cn("absolute inset-0 inline-flex items-center justify-center transition-transform duration-700", currentTheme === "dark" ? "rotate-0" : "rotate-90")}
          style={{ transition: "all 0.6s", transformOrigin: "50% 100px" }}
        >
          <MoonIcon />
        </div>
        <div
          className={cn("absolute inset-0 inline-flex items-center justify-center transition-transform duration-700", currentTheme === "light" ? "rotate-0" : "-rotate-90")}
          style={{ transition: "all 0.6s", transformOrigin: "50% 100px" }}
        >
          <SunIcon />
        </div>
        <div
          className={cn("absolute inset-0 inline-flex items-center justify-center transition-all duration-700", currentTheme === "system" ? "top-0" : "top-24")}
          style={{ transition: "all 0.6s", transformOrigin: "50% 100px" }}
        >
          <SystemIcon />
        </div>
      </div>
    </button>
  );
}
