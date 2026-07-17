import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, invalid, children, ...props }, ref) => {
  return (
    <div className="relative w-full">
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          "flex h-12  w-full max-w-full min-w-0 appearance-none rounded-full border border-border bg-input px-3 py-2 pr-9 text-sm text-foreground transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:border-indigo-600",
          "disabled:cursor-not-allowed disabled:opacity-50",
          invalid && "border-red-500 focus-visible:ring-red-600",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="size-5 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
    </div>
  );
});
Select.displayName = "Select";
