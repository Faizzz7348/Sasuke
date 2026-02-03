import { cn } from "@/lib/utils"

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  }

  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("animate-spin", sizeClasses[size], className)}
      role="status"
      aria-label="Loading"
    >
      <path
        d="M7.49991 1.70001C7.49991 1.3134 7.1865 1 6.79989 1C6.41329 1 6.09989 1.3134 6.09989 1.70001V4.50001C6.09989 4.88661 6.41329 5.20001 6.79989 5.20001C7.1865 5.20001 7.49991 4.88661 7.49991 4.50001V1.70001ZM1.70001 7.49998C1.3134 7.49998 1 7.81338 1 8.19998C1 8.58659 1.3134 8.89999 1.70001 8.89999H4.50001C4.88661 8.89999 5.20001 8.58659 5.20001 8.19998C5.20001 7.81338 4.88661 7.49998 4.50001 7.49998H1.70001ZM7.49991 10.5C7.49991 10.1134 7.1865 9.79998 6.79989 9.79998C6.41329 9.79998 6.09989 10.1134 6.09989 10.5V13.3C6.09989 13.6866 6.41329 14 6.79989 14C7.1865 14 7.49991 13.6866 7.49991 13.3V10.5ZM10.5 7.49998C10.1134 7.49998 9.79998 7.81338 9.79998 8.19998C9.79998 8.58659 10.1134 8.89999 10.5 8.89999H13.3C13.6866 8.89999 14 8.58659 14 8.19998C14 7.81338 13.6866 7.49998 13.3 7.49998H10.5Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  )
}

export function LoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <Spinner size="lg" />
      <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
    </div>
  )
}

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="xl" />
        <p className="text-lg font-medium animate-pulse">Loading...</p>
      </div>
    </div>
  )
}
