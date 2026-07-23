import * as React from "react";

export const ModalFooter = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(function ModalFooter(props, ref) {
  return (
    <div ref={ref} {...props}>
      {props.children}
    </div>
  );
});
