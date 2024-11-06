import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "inline-flex items-center text-sm w-full rounded-md focus:ring-2 focus:ring-sub  focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-subAlt text-text ",
        outline:
          "border border-neutral-200 bg-white hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50",
        secondary: "text-text bg-subAlt hover:bg-sub hover:text-main",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Input = React.forwardRef(
  ({ className, type, variant, size, ...props }, ref) => {
    return (
      <input
        className={cn(inputVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        type={type}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
