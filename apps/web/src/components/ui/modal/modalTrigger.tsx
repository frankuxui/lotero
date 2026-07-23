import * as React from "react";
import { useMergeRefs } from "@floating-ui/react";
import { useModalContext } from "./modalContext";

export interface ModalTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export const ModalTrigger = React.forwardRef<HTMLElement, React.HTMLProps<HTMLElement> & ModalTriggerProps>(function ModalTrigger({ children, asChild = false, ...props }, ref) {
  const ctx = useModalContext();

  const childrenRef = (children as any)?.ref;
  const mergedRef = useMergeRefs([ctx.refs.setReference, ref, childrenRef]);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children,
      ctx.getReferenceProps({
        ref: mergedRef,
        ...props,
        ...(children.props || {}),
        "data-state": ctx.open ? "open" : "closed"
      }) as any
    );
  }

  return (
    <button type="button" ref={mergedRef} {...ctx.getReferenceProps(props)} data-state={ctx.open ? "open" : "closed"}>
      {children}
    </button>
  );
});
