import { PopoverContext } from "./popoverContext";
import { usePopover } from "./usePopover";
import type { PopoverProps } from "./PopoverProps";

export function Popover({ children, ...options }: PopoverProps) {
  const popover = usePopover(options);

  return <PopoverContext.Provider value={popover}>{children}</PopoverContext.Provider>;
}
