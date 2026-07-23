import * as React from "react";
import { useMergeRefs } from "@floating-ui/react";
import { usePopoverContext } from "./popoverContext";

export const PopoverTrigger = React.forwardRef<HTMLElement, React.HTMLProps<HTMLElement> & { asChild?: boolean }>(function PopoverTrigger({ children, asChild = false, ...props }, propRef) {
  const context = usePopoverContext();
  const childrenRef = (children as any)?.ref;
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children,
      context.getReferenceProps({
        ref,
        ...props,
        ...(children.props as any),
        "data-state": context.open ? "open" : "closed"
      })
    );
  }

  return (
    <button ref={ref} type="button" data-state={context.open ? "open" : "closed"} {...context.getReferenceProps(props)}>
      {children}
    </button>
  );
});
