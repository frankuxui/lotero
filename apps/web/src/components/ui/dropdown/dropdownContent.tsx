import * as React from "react";
import { FloatingPortal, FloatingOverlay, FloatingFocusManager } from "@floating-ui/react";
import { DropdownContext } from "./dropdownContext";
import { cn } from "@/lib/utils";
import { useMergeRefs } from "@floating-ui/react";

export interface DropdownContentProps extends React.HTMLAttributes<HTMLDivElement> {
  placement?: "top" | "bottom" | "left" | "right" | "top-start" | "top-end" | "bottom-start" | "bottom-end" | "left-start" | "left-end" | "right-start" | "right-end";
}

export const DropdownContent = React.forwardRef<HTMLDivElement, DropdownContentProps>(function DropdownContent({ children, className, placement, ...props }, ref) {
  const ctx = React.useContext(DropdownContext);
  if (!ctx) throw new Error("DropdownContent must be used within a DropdownProvider");

  const { isOpen, refs, floatingStyles, getFloatingProps, setPlacementState, context } = ctx;
  const mergedRef = useMergeRefs([refs.setFloating, ref]);

  React.useEffect(() => {
    if (placement) setPlacementState(placement);
  }, [placement, setPlacementState]);

  if (!isOpen) return null;

  return (
    <FloatingPortal>
      <FloatingOverlay lockScroll className="bg-foreground/10 z-20 fixed" />
      <FloatingFocusManager context={context} modal={false} outsideElementsInert={false} closeOnFocusOut guards>
        <div ref={mergedRef} style={floatingStyles} {...getFloatingProps()} {...props} className="fixed min-w-0 max-w-min z-50">
          <div tabIndex={-1} className={cn("frankuxui-dropdown-content", className)}>
            {children}
          </div>
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
});
