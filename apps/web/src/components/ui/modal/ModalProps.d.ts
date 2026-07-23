import type React from "react";

export type Placement = "top" | "top-start" | "top-end" | "center" | "center-start" | "center-end" | "bottom" | "bottom-start" | "bottom-end";

// ❗ Este tipo es SOLO para el HOOK
export interface ModalOptions {
  initialOpen?: boolean;
  open?: boolean;
  onOpenChange?: (_open: boolean) => void;
  staticOverlay?: boolean;
  placement?: Placement;
}

// ❗ Este tipo es para el componente <Modal/>
export interface ModalProps extends ModalOptions {
  children: React.ReactNode;
}
