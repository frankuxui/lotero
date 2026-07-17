"use client";
import { cn } from "@/lib/utils";
import React from "react";
import type { ComponentProps } from "react";

export interface SpinnerProps extends Omit<ComponentProps<"div">, "variant"> {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  variant?: "light" | "dark";
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(({ className, size = "md", variant = "dark", ...props }, ref) => {
  //
  // Always returns a valid value in case of invalid size

  const sizes: string[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl"];
  const regex = /^\d+(px|rem|em|%|vh|vw|vmin|vmax)$/;
  let sizeValue = size.toString();

  if (!regex.test(sizeValue) && !sizes.includes(sizeValue)) {
    sizeValue = "1rem";
  } else {
    sizeValue = size.toString();
  }

  return (
    <div
      ref={ref}
      className={cn(
        "inline-block flex-none border-2 rounded-full animate-spin animate-infinite animate-duration-1000",
        size === "xs" && "w-4 h-4 border-2",
        size === "sm" && "w-5 h-5",
        size === "md" && "w-6 h-6",
        size === "lg" && "w-7 h-7",
        size === "xl" && "w-8 h-8",
        size === "2xl" && "w-9 h-9",
        size === "3xl" && "w-12 h-12",
        size === "4xl" && "w-14 h-14",
        size === "5xl" && "w-16 h-16",

        variant === "dark" && "border-black/20 border-t-black dark:border-white/30 dark:border-t-white",
        variant === "light" && "border-white/30 border-t-white",

        className
      )}
      style={typeof sizeValue === "number" || regex.test(sizeValue) ? { width: sizeValue, height: sizeValue } : {}}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
});

Spinner.displayName = "Spinner";

export { Spinner };
