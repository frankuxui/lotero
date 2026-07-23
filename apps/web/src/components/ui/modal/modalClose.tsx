import * as React from "react";
import { useMergeRefs } from "@floating-ui/react";
import { useModalContext } from "./modalContext";

export interface ModalCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const ModalClose = React.forwardRef<HTMLButtonElement, ModalCloseProps>(function ModalClose({ asChild = false, children, ...props }, ref) {
  const ctx = useModalContext();
  const childRef = (children as any)?.ref;
  const mergedRef = useMergeRefs([ref, childRef]);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ...(children.props || {}),
      ...props,
      ref: mergedRef,
      onClick: (e: any) => {
        (children.props as any)?.onClick?.(e);
        ctx.setOpen(false);
      }
    });
  }

  return (
    <button
      type="button"
      ref={mergedRef}
      {...props}
      onClick={(e) => {
        props.onClick?.(e);
        ctx.setOpen(false);
      }}
    >
      {children}
    </button>
  );
});
