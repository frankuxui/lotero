import * as React from "react";

export const ModalBody = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(function ModalBody(props, ref) {
  return (
    <section ref={ref} {...props}>
      {props.children}
    </section>
  );
});
