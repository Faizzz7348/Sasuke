import { createContext } from "react"
import type { ToastType } from "@/components/ui/toast"

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined)
