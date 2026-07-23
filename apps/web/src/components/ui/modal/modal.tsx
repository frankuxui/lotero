import { ModalContext } from "./modalContext";
import { useModal } from "./useModal";
import type { ModalProps } from "./ModalProps";

export function Modal({ children, ...options }: ModalProps) {
  const modal = useModal(options);

  return <ModalContext.Provider value={modal}>{children}</ModalContext.Provider>;
}
