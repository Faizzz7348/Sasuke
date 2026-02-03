import { type ReactNode, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Trigger animation on mount with requestAnimationFrame for smoother start
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsVisible(true)
      })
    })
    
    return () => {
      setIsVisible(false)
    }
  }, [])

  if (!isMounted) return null

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-in-out will-change-[transform,opacity]",
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-2 scale-[0.98]",
        className
      )}
      style={{
        transformOrigin: "top center"
      }}
    >
      {children}
    </div>
  )
}

export function FadeIn({ children, delay = 0, className }: PageTransitionProps & { delay?: number }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      requestAnimationFrame(() => {
        setIsVisible(true)
      })
    }, delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={cn(
        "transition-all duration-500 ease-out will-change-[transform,opacity]",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-[0.96]",
        className
      )}
    >
      {children}
    </div>
  )
}

export function SlideIn({
  children,
  direction = "left",
  delay = 0,
  className,
}: PageTransitionProps & {
  direction?: "left" | "right" | "up" | "down"
  delay?: number
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      requestAnimationFrame(() => {
        setIsVisible(true)
      })
    }, delay)
    return () => clearTimeout(timer)
  }, [delay])

  const directionClasses = {
    left: isVisible ? "translate-x-0" : "-translate-x-6",
    right: isVisible ? "translate-x-0" : "translate-x-6",
    up: isVisible ? "translate-y-0" : "-translate-y-6",
    down: isVisible ? "translate-y-0" : "translate-y-6",
  }

  return (
    <div
      className={cn(
        "transition-all duration-400 ease-out will-change-[transform,opacity]",
        isVisible ? "opacity-100" : "opacity-0",
        directionClasses[direction],
        className
      )}
    >
      {children}
    </div>
  )
}
