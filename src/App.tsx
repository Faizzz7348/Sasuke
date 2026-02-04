import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { EditModeProvider } from "@/contexts/EditModeProvider"
import { ToastProvider } from "@/contexts/ToastProvider"
import { PageTransition } from "@/components/ui/page-transition"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { SEO } from "@/components/SEO"
import { lazy, Suspense, useState, useTransition } from "react"
import { LoadingCard } from "@/components/ui/loading-card"
import { Spinner } from "@/components/ui/spinner"

// Lazy load pages for better code splitting
const AllTables = lazy(() => import("@/pages/AllTables").then(m => ({ default: m.AllTables })))
const TableDetail = lazy(() => import("@/pages/TableDetail").then(m => ({ default: m.TableDetail })))
const Overview = lazy(() => import("@/pages/Overview").then(m => ({ default: m.Overview })))

function AppContent() {
  const [currentView, setCurrentView] = useState<"overview" | "list" | "detail">("overview")
  const [currentRegion, setCurrentRegion] = useState<"selangor" | "kl">("selangor")
  const [selectedTableId, setSelectedTableId] = useState<string | undefined>()
  const [selectedTableName, setSelectedTableName] = useState<string | undefined>()
  const [isPending, startTransition] = useTransition()

  const handleNavigate = (view: "overview" | "list" | "detail", region?: "selangor" | "kl", tableId?: string, tableName?: string) => {
    startTransition(() => {
      setCurrentView(view)
      if (region) {
        setCurrentRegion(region)
      }
      if (tableId) {
        setSelectedTableId(tableId)
      }
      if (tableName) {
        setSelectedTableName(tableName)
      }
    })
  }

  const pageTitle = currentView === "overview" 
    ? "Overview - Sasuke Route Management"
    : currentView === "list"
    ? `${currentRegion === "selangor" ? "Selangor" : "Kuala Lumpur"} Routes - Sasuke`
    : selectedTableName
    ? `${selectedTableName} - Sasuke`
    : "Route Details - Sasuke"

  return (
    <>
      <SEO 
        title={pageTitle}
        description={`Manage and view ${currentView === "overview" ? "all routes" : currentView === "list" ? `routes in ${currentRegion}` : "route details"}`}
      />
      <SidebarProvider>
      <AppSidebar onNavigate={handleNavigate} />
      <SidebarInset>
        <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 bg-background/95 backdrop-blur-sm border-b z-50 transition-all duration-200 ease-out group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 supports-[backdrop-filter]:bg-background/80" role="banner">
          <div className="flex items-center gap-2 px-4 flex-1">
            <SidebarTrigger className="-ml-1" aria-label="Toggle sidebar" />
            <Separator orientation="vertical" className="mr-2 h-4" aria-hidden="true" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#" onClick={() => setCurrentView("overview")}>
                    Route List
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" aria-hidden="true" />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {currentView === "overview" 
                      ? "Overview" 
                      : currentView === "list" 
                      ? (currentRegion === "selangor" ? "Selangor" : "Kuala Lumpur")
                      : "Table Detail"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2 px-4">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-4 overflow-auto" role="main">
          {isPending && (
            <div className="fixed inset-0 z-[9999] bg-background/95 backdrop-blur-md flex items-center justify-center animate-fade-in">
              <div className="flex flex-col items-center gap-6">
                <Spinner size="xl" className="text-primary" />
                <p className="text-base font-medium text-muted-foreground">Loading...</p>
              </div>
            </div>
          )}
          <Suspense fallback={<LoadingCard count={3} />}>
            <PageTransition key={`${currentView}-${currentRegion}-${selectedTableId}`}>
              {currentView === "overview" ? (
                <Overview onNavigateToTables={(region) => {
                  handleNavigate("list", region)
                }} />
              ) : currentView === "list" ? (
                <AllTables onViewTable={(tableId, tableName) => handleNavigate("detail", currentRegion, tableId, tableName)} region={currentRegion} />
              ) : (
                <TableDetail onBack={currentRegion ? () => handleNavigate("list", currentRegion) : undefined} tableId={selectedTableId} tableName={selectedTableName} />
              )}
            </PageTransition>
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </>
  )
}

export function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <EditModeProvider>
          <AppContent />
        </EditModeProvider>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
