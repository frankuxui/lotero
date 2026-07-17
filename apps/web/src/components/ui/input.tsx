import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, invalid, ...props }, ref) => {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        "h-12 rounded-full border border-border bg-input px-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:border-indigo-600",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "text-foreground placeholder:text-foreground/70",
        invalid && "border-red-500 focus-visible:ring-red-600",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";
