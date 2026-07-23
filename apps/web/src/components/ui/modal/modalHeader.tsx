import * as React from "react";
import { useModalContext } from "./modalContext";
import { useId } from "@floating-ui/react";

export const ModalHeader = React.forwardRef<HTMLElement, React.HTMLProps<HTMLElement>>(function ModalHeader({ children, ...props }, ref) {
  const { setLabelId } = useModalContext();
  const id = useId();

  React.useLayoutEffect(() => {
    setLabelId(id);
    return () => setLabelId(undefined);
  }, [id, setLabelId]);

  return (
    <header ref={ref} id={id} {...props}>
      {children}
    </header>
  );
});
