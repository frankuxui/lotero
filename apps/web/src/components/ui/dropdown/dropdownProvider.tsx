import * as React from "react";
import { autoPlacement, autoUpdate, flip, offset, shift, useClick, useDismiss, useFloating, useInteractions } from "@floating-ui/react";
import type { DropdownPlacement } from "./dropdownContext";
import { DropdownContext } from "./dropdownContext";

export function DropdownProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [placementState, setPlacementState] = React.useState<DropdownPlacement>("bottom-start");

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    strategy: "absolute",
    placement: placementState,
    middleware: [
      autoPlacement({
        autoAlignment: true,
        alignment: "start",
        crossAxis: true,
        allowedPlacements: ["top", "bottom"]
      }),
      offset(2),
      flip({ fallbackAxisSideDirection: "end" }),
      shift()
    ],
    whileElementsMounted: autoUpdate
  });

  const click = useClick(context, { toggle: true });
  const dismiss = useDismiss(context, {
    escapeKey: true,
    outsidePressEvent: "click"
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  const value = React.useMemo(
    () => ({
      isOpen,
      setIsOpen,
      refs,
      floatingStyles,
      getReferenceProps,
      getFloatingProps,
      context,
      placementState,
      setPlacementState
    }),
    [isOpen, refs, floatingStyles, getReferenceProps, getFloatingProps, context, placementState, setPlacementState]
  );

  return <DropdownContext.Provider value={value}>{children}</DropdownContext.Provider>;
}
