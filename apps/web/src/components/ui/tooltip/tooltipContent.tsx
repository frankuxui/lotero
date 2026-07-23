import * as React from "react";
import { FloatingPortal, useMergeRefs } from "@floating-ui/react";
import { useTooltipContext } from "./tooltipContext";
import { cn } from "@/lib/utils";

interface TooltipContentProps extends React.HTMLProps<HTMLDivElement> {
  style?: React.CSSProperties;
  className?: string;
}

export const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(function TooltipContent({ style, className, ...props }, propRef) {
  const context = useTooltipContext();

  const ref = useMergeRefs([context.refs.setFloating, propRef]);

  if (!context.open) return null;

  return (
    <FloatingPortal>
      <div
        ref={ref}
        style={{
          ...context.floatingStyles,
          ...style
        }}
        className={cn("bg-foreground text-background z-50 w-fit rounded px-3 py-1.5 text-xs text-balance", className)}
        {...context.getFloatingProps(props)}
      />
    </FloatingPortal>
  );
});
