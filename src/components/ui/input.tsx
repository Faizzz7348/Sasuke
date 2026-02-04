import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-lg border border-border bg-input px-4 py-2.5 text-sm shadow-sm",
        "text-foreground placeholder:text-muted-foreground",
        "transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "focus:border-primary focus:ring-4 focus:ring-primary/15 focus:shadow-md focus:bg-background",
        "hover:border-primary/50 hover:shadow-sm",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/15",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "selection:bg-primary selection:text-primary-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Input }
