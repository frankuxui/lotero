import * as React from "react";
import { useFloating, autoUpdate, offset, flip, shift, useClick, useHover, useDismiss, useRole, useInteractions } from "@floating-ui/react";
import type { PopoverOptions } from "./PopoverProps";

export interface UsePopoverReturn {
  open: boolean;
  setOpen: (_open: boolean) => void;
  modal?: boolean;
  labelId?: string;
  descriptionId?: string;
  setLabelId: (_id: string | undefined) => void;
  setDescriptionId: (_id: string | undefined) => void;
  refs: any;
  floatingStyles: React.CSSProperties;
  getReferenceProps: any;
  getFloatingProps: any;
  context: any;
}

export function usePopover({ initialOpen = false, placement = "bottom", modal = false, trigger = "click", open: controlledOpen, onOpenChange }: PopoverOptions = {}): UsePopoverReturn {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);
  const [labelId, setLabelId] = React.useState<string | undefined>();
  const [descriptionId, setDescriptionId] = React.useState<string | undefined>();

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const floating = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        crossAxis: placement.includes("-"),
        fallbackAxisSideDirection: "end",
        padding: 5
      }),
      shift({ padding: 5 })
    ]
  });

  const context = floating.context;

  const click = useClick(context, {
    enabled: trigger === "click" && controlledOpen == null
  });

  const hover = useHover(context, {
    enabled: trigger === "hover" && controlledOpen == null,
    move: false
  });

  const dismiss = useDismiss(context);
  const role = useRole(context);

  const interactions = useInteractions([trigger === "click" ? click : hover, dismiss, role]);

  return React.useMemo(
    () => ({
      open,
      setOpen,
      ...floating,
      ...interactions,
      modal,
      labelId,
      descriptionId,
      setLabelId,
      setDescriptionId
    }),
    [open, setOpen, floating, interactions, modal, labelId, descriptionId]
  );
}
