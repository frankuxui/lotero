import * as React from "react";
import { FloatingPortal, FloatingOverlay, FloatingFocusManager, useMergeRefs } from "@floating-ui/react";
import { motion, AnimatePresence } from "motion/react";
import { useModalContext } from "./modalContext";
import { cn } from "@/lib/utils";

export const ModalContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement> & {
    draggable?: boolean;
    drag?: boolean;
    dragConstraints?: any;
    dragElastic?: number;
    dragListener?: boolean;
    dragControls?: any;
  }
>(function ModalContent(props, ref) {
  const { draggable, drag, dragConstraints, dragElastic, dragListener, dragControls, className, children, ...floatingProps } = props;

  // Context

  const { context: floatingContext, refs, open, isClosing, setOpen, staticOverlay, placementState, getFloatingProps, labelId, descriptionId } = useModalContext();

  const mergedRef = useMergeRefs([refs.setFloating, ref]);
  const overlayRef = React.useRef<HTMLDivElement>(null);

  // Animation bump if staticOverlay is true
  const bumpAnimation = React.useCallback(() => {
    const modal = refs.floating.current;
    if (!modal) return;
    modal.style.transition = "transform 0.3s ease";
    modal.style.transform = "scale(1.01)";
    setTimeout(() => {
      modal.style.transition = "transform 0.2s ease";
      modal.style.transform = "scale(1)";
    }, 40);
  }, [refs]);

  // ESC key handler
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;

      if (staticOverlay) {
        bumpAnimation();
        return;
      }

      if (overlayRef.current?.contains(document.activeElement)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [staticOverlay, setOpen, bumpAnimation]);

  // Early return
  if (!open && !isClosing) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (staticOverlay) bumpAnimation();
    else setOpen(false);
  };

  return (
    <FloatingPortal>
      <FloatingOverlay
        ref={overlayRef}
        onClick={handleOverlayClick}
        lockScroll={false}
        className={cn(
          "fixed inset-0 z-30 flex p-6 bg-foreground/20 transition-all duration-300",
          placementState === "top" && "justify-center items-start",
          placementState === "center" && "justify-center items-center",
          placementState === "bottom" && "justify-center items-end",
          placementState === "top-start" && "justify-start items-start",
          placementState === "top-end" && "justify-end items-start",
          placementState === "center-start" && "justify-start items-center",
          placementState === "center-end" && "justify-end items-center",
          placementState === "bottom-start" && "justify-start items-end",
          placementState === "bottom-end" && "justify-end items-end"
        )}
      >
        <FloatingFocusManager context={floatingContext}>
          <AnimatePresence>
            {open && !isClosing && (
              <motion.div
                ref={mergedRef}
                initial={{ scale: 0.9 }}
                animate={{ scale: [0.9, 1.02, 1] }}
                exit={{ scale: [1, 1.05, 0.9] }}
                transition={{
                  duration: 0.3,
                  times: [0, 0.7, 1],
                  ease: [0.25, 0.1, 0.25, 1]
                }}
                aria-labelledby={labelId}
                aria-describedby={descriptionId}
                {...getFloatingProps(floatingProps)}
                className={cn("w-full rounded-lg bg-background text-foreground shadow-2xl", className)}
                drag={drag ?? draggable}
                dragControls={dragControls}
                dragListener={dragListener}
                dragElastic={dragElastic}
                dragConstraints={dragConstraints}
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
});
