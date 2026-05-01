"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

function Progress({
  className,
  indicatorClassName,
  value = 0,
  ...props
}) {
  return (
    <ProgressPrimitive.Root
      value={value}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full transition-all duration-500 ease-in-out",
          indicatorClassName
        )}
        style={{
          width: `${Math.min(value, 100)}%`,
        }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };