import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-subAlt", className)}
      {...props}
    />
  );
}

export { Skeleton };
