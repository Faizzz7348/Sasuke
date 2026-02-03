import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface BadgeProps {
  children: ReactNode
  variant?: "default" | "success" | "warning" | "error" | "info" | "outline"
  size?: "sm" | "md" | "lg"
  className?: string
  pulse?: boolean
}

export function Badge({
  children,
  variant = "default",
  size = "md",
  className,
  pulse = false,
}: BadgeProps) {
  const variantClasses = {
    default: "bg-primary/10 text-primary border-primary/20",
    success: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
    error: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
    info: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    outline: "bg-transparent border-border text-foreground",
  }

  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-xs px-2 py-0.5",
    lg: "text-sm px-2.5 py-1",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium rounded-full border transition-all",
        variantClasses[variant],
        sizeClasses[size],
        pulse && "animate-pulse",
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
        </span>
      )}
      {children}
    </span>
  )
}
