import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  const spinnerRef = useRef<HTMLDivElement>(null)
  
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
    xl: "h-16 w-16 border-4",
  }

  useEffect(() => {
    if (spinnerRef.current) {
      // Force animation via DOM
      spinnerRef.current.style.animation = 'none'
      void spinnerRef.current.offsetHeight // Trigger reflow
      spinnerRef.current.style.animation = 'spinner-rotate 0.6s linear infinite'
    }
  }, [])

  return (
    <>
      <style>{`
        @keyframes spinner-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div
        ref={spinnerRef}
        className={cn(
          "inline-block rounded-full border-solid border-primary/30 border-t-primary",
          sizeClasses[size],
          className
        )}
        role="status"
        aria-label="Loading"
        style={{
          animation: "spinner-rotate 0.6s linear infinite",
          willChange: "transform"
        }}
      />
    </>
  )
}

export function LoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 animate-fade-in">
      <Spinner size="lg" className="text-primary" />
      <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
    </div>
  )
}

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md animate-fade-in">
      <div className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 shadow-2xl animate-scale-in">
        <Spinner size="xl" className="text-primary" />
        <p className="text-lg font-medium animate-pulse">Loading...</p>
      </div>
    </div>
  )
}
