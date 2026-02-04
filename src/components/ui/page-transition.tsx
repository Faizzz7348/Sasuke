import { type ReactNode, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation with slight delay for smooth transition
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 50)
    
    return () => {
      clearTimeout(timer)
      setIsVisible(false)
    }
  }, [])

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[transform,opacity]",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4",
        className
      )}
    >
      {children}
    </div>
  )
}

export function FadeIn({ children, delay = 0, className }: PageTransitionProps & { delay?: number }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay + 50)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={cn(
        "transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-opacity",
        isVisible ? "opacity-100" : "opacity-0",
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
      setIsVisible(true)
    }, delay + 50)
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
        "transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[transform,opacity]",
        isVisible ? "opacity-100" : "opacity-0",
        directionClasses[direction],
        className
      )}
    >
      {children}
    </div>
  )
}

export function ScaleIn({ children, delay = 0, className }: PageTransitionProps & { delay?: number }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay + 50)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={cn(
        "transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[transform,opacity]",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
        className
      )}
    >
      {children}
    </div>
  )
}

export function StaggeredList({
  children,
  staggerDelay = 50,
  className,
}: {
  children: ReactNode[]
  staggerDelay?: number
  className?: string
}) {
  return (
    <div className={className}>
      {Array.isArray(children) &&
        children.map((child, index) => (
          <FadeIn key={index} delay={index * staggerDelay}>
            {child}
          </FadeIn>
        ))}
    </div>
  )
}
