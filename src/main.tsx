import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/contexts/ThemeProvider"
import { registerServiceWorker } from "@/lib/pwa"

// Register Service Worker for PWA
registerServiceWorker()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="lasttable-theme">
      <App />
    </ThemeProvider>
  </StrictMode>
)
