import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

const sheetSideClass = {
  right: "inset-y-0 right-0 h-full w-full max-w-sm border-l",
  bottom: "inset-x-0 bottom-0 max-h-[85vh] rounded-t-lg border-t"
};

const sheetSideMotion = {
  right: { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } },
  bottom: { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } }
};

interface SheetContentProps extends Omit<React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>, "asChild" | "forceMount"> {
  side?: keyof typeof sheetSideClass;
  /** Debe reflejar el `open` del `Sheet` padre: controla el montaje para que AnimatePresence anime la salida. */
  open: boolean;
  closeButton?: boolean;
}

export function SheetContent({ className, side = "bottom", open, children, closeButton = true, ...props }: SheetContentProps) {
  return (
    <AnimatePresence>
      {open && (
        <DialogPrimitive.Portal forceMount>
          <DialogPrimitive.Overlay asChild forceMount className="bg-foreground/10! backdrop-blur-xs">
            <motion.div className="fixed inset-0 z-50 bg-slate-950/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
          </DialogPrimitive.Overlay>
          <DialogPrimitive.Content asChild forceMount {...props} className="max-w-68!">
            <motion.div
              className={cn("fixed z-50 flex flex-col gap-4 bg-background border-0!", sheetSideClass[side], className)}
              {...sheetSideMotion[side]}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            >
              {children}
              {closeButton && (
                <DialogPrimitive.Close
                  className="absolute right-4 top-4 rounded-sm transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 "
                  aria-label="Cerrar"
                >
                  <X className="size-4" />
                </DialogPrimitive.Close>
              )}
            </motion.div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      )}
    </AnimatePresence>
  );
}

export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("w-full", className)} {...props} />;
}

export const SheetTitle = React.forwardRef<React.ComponentRef<typeof DialogPrimitive.Title>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold text-foreground", className)} {...props} />
));
SheetTitle.displayName = "SheetTitle";
