import * as React from "react";
import type { FloatingContext } from "@floating-ui/react";

export type DropdownPlacement = "top" | "top-start" | "top-end" | "right" | "right-start" | "right-end" | "bottom" | "bottom-start" | "bottom-end" | "left" | "left-start" | "left-end";

export interface DropdownContextValue {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refs: {
    setReference: (_node: HTMLElement | null) => void;
    setFloating: (_node: HTMLElement | null) => void;
  };
  floatingStyles: React.CSSProperties;
  getFloatingProps: (_userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>;
  getReferenceProps: (_userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>;
  placementState: DropdownPlacement;
  setPlacementState: React.Dispatch<React.SetStateAction<DropdownPlacement>>;
  context: FloatingContext;
}

export const DropdownContext = React.createContext<DropdownContextValue | undefined>(undefined);

export function useDropdownContext() {
  const ctx = React.useContext(DropdownContext);
  if (!ctx) throw new Error("useDropdownContext must be used within a DropdownProvider");
  return ctx;
}
