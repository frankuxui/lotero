import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { animate, AnimatePresence, motion, useMotionValue, useReducedMotion } from "motion/react";
import { Close } from "../ui/close";

type MobileMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: ReactNode;
};

function getViewportHeight() {
  return Math.round(window.visualViewport?.height ?? window.innerHeight);
}

export function MobileSheet({ open, onOpenChange, title = "Panel", children }: MobileMenuProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [viewportHeight, setViewportHeight] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const panelY = useMotionValue(0);
  const openingAnimationRef = useRef<{ stop: () => void } | null>(null);
  const dragStateRef = useRef<{ pointerId: number; pointerY: number; panelY: number } | null>(null);
  const closingRef = useRef(false);
  const closeAnimationRef = useRef<() => Promise<void>>(async () => undefined);

  useLayoutEffect(() => {
    const updateViewportHeight = () => {
      setViewportHeight(getViewportHeight());
    };

    updateViewportHeight();
    window.addEventListener("resize", updateViewportHeight);
    window.visualViewport?.addEventListener("resize", updateViewportHeight);

    return () => {
      window.removeEventListener("resize", updateViewportHeight);
      window.visualViewport?.removeEventListener("resize", updateViewportHeight);
    };
  }, []);

  useLayoutEffect(() => {
    if (!open || viewportHeight === 0) return;

    openingAnimationRef.current?.stop();
    panelY.set(viewportHeight);

    if (shouldReduceMotion) {
      panelY.set(viewportHeight / 2);
      return;
    }

    const controls = animate(panelY, viewportHeight / 2, {
      type: "spring",
      stiffness: 360,
      damping: 28,
      mass: 0.9
    });
    openingAnimationRef.current = controls;

    return () => controls.stop();
  }, [open, panelY, shouldReduceMotion, viewportHeight]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") void closeAnimationRef.current();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleClose = useCallback(async () => {
    if (closingRef.current) return;

    closingRef.current = true;
    setIsClosing(true);
    openingAnimationRef.current?.stop();
    dragStateRef.current = null;

    if (!shouldReduceMotion && viewportHeight > 0) {
      await animate(panelY, viewportHeight, {
        type: "spring",
        stiffness: 360,
        damping: 32,
        mass: 0.9
      });
    }

    onOpenChange(false);
    closingRef.current = false;
    setIsClosing(false);
  }, [shouldReduceMotion, viewportHeight, panelY, onOpenChange]);

  useEffect(() => {
    closeAnimationRef.current = handleClose;
  }, [handleClose]);

  const handleDragStart = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (shouldReduceMotion || viewportHeight === 0 || isClosing) return;

    openingAnimationRef.current?.stop();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStateRef.current = {
      pointerId: event.pointerId,
      pointerY: event.clientY,
      panelY: panelY.get()
    };
  };

  const handleDragMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    const nextPosition = dragState.panelY + event.clientY - dragState.pointerY;
    panelY.set(Math.min(viewportHeight, Math.max(0, nextPosition)));
  };

  const handleDragEnd = async (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (dragStateRef.current?.pointerId !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const currentY = panelY.get();
    const shouldExpand = currentY < viewportHeight * 0.2;
    const shouldClose = currentY > viewportHeight * 0.72;
    dragStateRef.current = null;

    if (shouldClose) {
      await handleClose();
      return;
    }

    const snapPoint = shouldExpand ? 0 : viewportHeight / 2;

    if (!shouldReduceMotion && viewportHeight > 0) {
      await animate(panelY, snapPoint, {
        type: "spring",
        stiffness: 360,
        damping: 30,
        mass: 0.9
      });
      return;
    }

    panelY.set(snapPoint);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.24 }}
          role="presentation"
        >
          <motion.button
            className="absolute inset-0 h-full w-full bg-black/45 backdrop-blur-xs"
            type="button"
            aria-label="Cerrar panel"
            animate={{ opacity: isClosing ? 0 : 1 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.32 }}
            onClick={() => {
              void handleClose();
            }}
          />

          <motion.div
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="absolute inset-x-0 bottom-0 flex flex-col rounded-t-4xl border-t border-border bg-background pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl will-change-transform"
            initial={false}
            style={{ height: viewportHeight || "100dvh", y: panelY }}
          >
            <button
              type="button"
              data-testid="drag-handle"
              aria-label="Redimensionar menu"
              className="mx-auto flex w-full touch-none cursor-ns-resize select-none items-center justify-center py-6"
              onPointerDown={handleDragStart}
              onPointerMove={handleDragMove}
              onPointerUp={handleDragEnd}
              onPointerCancel={handleDragEnd}
            >
              <span className="h-1.5 w-12 rounded-full bg-foreground/15" aria-hidden="true" />
            </button>

            <div className="mb-4 flex items-center justify-between gap-3 px-10">
              <h2 className="text-base font-semibold text-foreground">{title}</h2>
              <Close ref={closeButtonRef} onClick={() => void handleClose()} aria-label="Cerrar panel" />
            </div>

            <div className="overflow-y-auto pt-2 px-10">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
