import { useFloating, useClick, useDismiss, useRole, useInteractions } from "@floating-ui/react";
import type { ModalOptions, Placement } from "./ModalProps";
import React from "react";

export interface UseModalReturn {
  open: boolean;
  setOpen: (value: boolean) => void;
  isClosing: boolean;
  staticOverlay?: boolean;
  placementState: Placement;
  labelId?: string;
  descriptionId?: string;
  setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>;
  setDescriptionId: React.Dispatch<React.SetStateAction<string | undefined>>;
  refs: any;
  context: any;
  getFloatingProps: any;
  getReferenceProps: any;
}

export function useModal({ initialOpen = false, open: controlledOpen, onOpenChange: setControlledOpen, staticOverlay = false, placement = "top" }: ModalOptions) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);
  const [labelId, setLabelId] = React.useState<string | undefined>();
  const [descriptionId, setDescriptionId] = React.useState<string | undefined>();
  const [isClosing, setIsClosing] = React.useState(false);
  const closeTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = controlledOpen ?? uncontrolledOpen;

  const setOpen = React.useCallback(
    (value: boolean) => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }

      if (!value && open) {
        setIsClosing(true);
        closeTimeoutRef.current = setTimeout(() => {
          setControlledOpen?.(false);
          setUncontrolledOpen(false);
          setIsClosing(false);
          closeTimeoutRef.current = null;
        }, 200);
      } else {
        setControlledOpen?.(value);
        setUncontrolledOpen(value);
      }
    },
    [open, setControlledOpen]
  );

  const data = useFloating({
    open,
    onOpenChange: setOpen
  });

  React.useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const context = data.context;

  const click = useClick(context, {
    // enabled: controlledOpen == null,
    enabled: true,
    keyboardHandlers: true
  });
  const dismiss = useDismiss(context, {
    outsidePressEvent: "mousedown",
    escapeKey: !staticOverlay,
    outsidePress: !staticOverlay,
    referencePressEvent: "mousedown",
    referencePress: true,
    enabled: controlledOpen == null,
    ancestorScroll: true
  });
  const role = useRole(context);

  const interactions = useInteractions([click, dismiss, role]);

  return React.useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      labelId,
      descriptionId,
      setLabelId,
      setDescriptionId,
      staticOverlay,
      isClosing,
      placementState: placement
    }),
    [open, setOpen, interactions, data, labelId, descriptionId, staticOverlay, isClosing, placement]
  );
}
