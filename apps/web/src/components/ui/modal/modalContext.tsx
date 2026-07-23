import * as React from "react";
import type { UseModalReturn } from "./useModal";

export const ModalContext = React.createContext<UseModalReturn | null>(null);

export function useModalContext() {
  const ctx = React.useContext(ModalContext);
  if (!ctx) throw new Error("Modal components must be inside <Modal>");
  return ctx;
}
