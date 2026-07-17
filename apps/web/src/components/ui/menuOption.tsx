import { memo, useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EllipsisVertical } from "lucide-react";
import { FloatingPortal, autoUpdate, flip, offset, shift, useClick, useDismiss, useFloating, useInteractions, useRole } from "@floating-ui/react";

import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export type MenuOptionItem =
  | {
      key: string;
      label: ReactNode;
      href: string;
      onClick?: never;
      className?: string;
      disabled?: boolean;
      target?: "_self" | "_blank" | "_parent" | "_top";
      rel?: string;
    }
  | {
      key: string;
      label: ReactNode;
      onClick: () => void | Promise<void>;
      href?: never;
      className?: string;
      disabled?: boolean;
    };

type MenuOptionProps = {
  items: readonly MenuOptionItem[];
  className?: string;
  menuClassName?: string;
  itemClassName?: string;
  buttonAriaLabel?: string;
};

function isHrefItem(item: MenuOptionItem): item is Extract<MenuOptionItem, { href: string }> {
  return typeof (item as { href?: unknown }).href === "string";
}

export const MenuOption = memo(function MenuOption({ items, className, menuClassName, itemClassName, buttonAriaLabel = "Opciones" }: MenuOptionProps) {
  "use no memo";

  const [open, setOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "bottom-end",
    transform: false,
    whileElementsMounted: autoUpdate,
    middleware: [offset(8), flip({ padding: 8 }), shift({ padding: 8 })]
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "menu" });
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  const closeMenu = useCallback(() => {
    setOpen(false);
  }, []);

  const menuItems = useMemo(() => items, [items]);

  return (
    <>
      <button
        type="button"
        ref={refs.setReference}
        data-state={open ? "open" : "closed"}
        className={cn(
          "inline-flex size-12 items-center ring-2 ring-transparent justify-center rounded-full text-foreground transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 data-[state=open]:bg-foreground/10 data-[state=open]:ring-blue-500 focus:ring-blue-500 focus:bg-background data-[state=open]:hover:bg-foreground/10 data-[state=open]:focus:bg-foreground/10",
          className
        )}
        aria-label={buttonAriaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        {...getReferenceProps()}
      >
        <EllipsisVertical className="size-6" aria-hidden="true" />
      </button>

      <FloatingPortal>
        <AnimatePresence>
          {open ? (
            <motion.div
              ref={refs.setFloating}
              style={floatingStyles}
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className={cn("z-50 min-w-48 rounded-2xl border border-border bg-card p-4 shadow-xl", menuClassName)}
              {...getFloatingProps()}
            >
              {menuItems.map((item) => {
                const baseClass = cn(
                  "flex w-full items-center rounded-xl px-4 py-3 font-semibold text-left text-sm text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                  itemClassName,
                  item.className
                );

                if (isHrefItem(item)) {
                  return (
                    <Link
                      key={item.key}
                      to={item.href}
                      target={item.target}
                      rel={item.rel}
                      aria-disabled={item.disabled}
                      className={baseClass}
                      onClick={(event) => {
                        if (item.disabled) {
                          event.preventDefault();
                          return;
                        }
                        closeMenu();
                      }}
                    >
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.key}
                    type="button"
                    className={baseClass}
                    disabled={item.disabled}
                    onClick={() => {
                      void item.onClick();
                      closeMenu();
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </FloatingPortal>
    </>
  );
});
