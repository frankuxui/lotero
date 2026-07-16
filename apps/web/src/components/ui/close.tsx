import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import React from "react";

interface CloseProps extends React.ComponentPropsWithoutRef<"button"> {
  className?: string;
  inline?: boolean;
  strokeWidth?: number;
  asChild?: boolean;
}

const Close = React.forwardRef<HTMLButtonElement, CloseProps>(({ className, asChild = false, inline = false, strokeWidth, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      type="button"
      aria-label="Close"
      ref={ref}
      className={cn(
        !inline && "close-button flex-none w-10 h-10 p-2 rounded-full inline-flex items-center justify-center transition-colors duration-300 hover:bg-foreground/10",
        inline && "inline-class",
        className
      )}
      {...props}
    >
      <span className="sr-only">Close menu</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        role="img" // Add role for accessibility
        aria-hidden="true" // Indicate that this is purely decorative
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth ?? 2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </Comp>
  );
});

Close.displayName = "Close";

export { Close };
