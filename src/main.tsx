import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClientProvider } from "@tanstack/react-query"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/contexts/ThemeProvider"
import { registerServiceWorker } from "@/lib/pwa"
import { queryClient } from "@/lib/react-query"
import { reportWebVitals, logWebVitals } from "@/lib/web-vitals"

// Register Service Worker for PWA
registerServiceWorker()

// Monitor Web Vitals
if (import.meta.env.DEV) {
  reportWebVitals(logWebVitals)
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="lasttable-theme">
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
)
