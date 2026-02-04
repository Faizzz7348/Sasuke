import { cn } from "@/lib/utils"

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
    xl: "h-16 w-16 border-4",
  }

  return (
    <div
      className={cn(
        "inline-block rounded-full border-solid animate-spin",
        "border-muted-foreground/20 border-t-foreground",
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  )
}

export function LoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 animate-fade-in">
      <Spinner size="lg" />
      <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
    </div>
  )
}

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md animate-fade-in">
      <div className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-card backdrop-blur-xl border shadow-2xl animate-scale-in">
        <Spinner size="xl" />
        <p className="text-lg font-medium text-foreground animate-pulse">Loading...</p>
      </div>
    </div>
  )
}
