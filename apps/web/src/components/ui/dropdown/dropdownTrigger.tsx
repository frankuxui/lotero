import * as React from "react";
import { useMergeRefs } from "@floating-ui/react";
import { useDropdownContext } from "./dropdownContext";

export interface DropdownTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export const DropdownTrigger = React.forwardRef<HTMLElement, React.HTMLProps<HTMLElement> & DropdownTriggerProps>(function DropdownTrigger({ children, asChild = false, ...props }, ref) {
  const ctx = useDropdownContext();
  const childRef = (children as React.ReactElement<HTMLElement> & { ref?: React.Ref<HTMLElement> })?.ref;
  const mergedRef = useMergeRefs([ctx.refs.setReference, ref, childRef]);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...ctx.getReferenceProps({
        ref: mergedRef,
        ...props,
        ...(children.props as unknown as React.HTMLProps<HTMLElement>)
      }),
      "data-state": ctx.isOpen ? "open" : "closed"
    } as unknown as React.HTMLProps<HTMLElement>);
  }

  return (
    <button type="button" ref={mergedRef} {...ctx.getReferenceProps(props)} data-state={ctx.isOpen ? "open" : "closed"}>
      {children}
    </button>
  );
});
