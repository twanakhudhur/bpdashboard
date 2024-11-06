import React from "react";
import { DropdownMenuTrigger } from "./dropdown-menu";
import { cn } from "@/lib/utils";

const CustomDropdownTrigger = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <DropdownMenuTrigger
      ref={ref}
      className={cn(
        "flex items-center justify-between rounded-lg px-4 py-1 outline-none text-text bg-subAlt hover:text-main transition-colors cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </DropdownMenuTrigger>
  )
);

CustomDropdownTrigger.displayName = "CustomDropdownTrigger";

export default CustomDropdownTrigger;
