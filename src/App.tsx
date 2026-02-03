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
import { AllTables } from "@/pages/AllTables"
import { TableDetail } from "@/pages/TableDetail"
import { Overview } from "@/pages/Overview"
import { SpinnerTest } from "@/pages/SpinnerTest"
import { ThemeToggle } from "@/components/theme-toggle"
import { EditModeProvider } from "@/contexts/EditModeProvider"
import { ToastProvider } from "@/contexts/ToastProvider"
import { PageTransition } from "@/components/ui/page-transition"
import { useState } from "react"

function AppContent() {
  const [currentView, setCurrentView] = useState<"overview" | "list" | "detail" | "spinner-test">("overview")
  const [currentRegion, setCurrentRegion] = useState<"selangor" | "kl">("selangor")
  const [selectedTableId, setSelectedTableId] = useState<string | undefined>()
  const [selectedTableName, setSelectedTableName] = useState<string | undefined>()

  const handleNavigate = (view: "overview" | "list" | "detail" | "spinner-test", region?: "selangor" | "kl", tableId?: string, tableName?: string) => {
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
  }

  return (
    <SidebarProvider>
      <AppSidebar onNavigate={handleNavigate} />
      <SidebarInset>
        <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 bg-background/95 backdrop-blur-sm border-b z-50 transition-all duration-200 ease-out group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 supports-[backdrop-filter]:bg-background/80">
          <div className="flex items-center gap-2 px-4 flex-1">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#" onClick={() => setCurrentView("overview")}>
                    Route List
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
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
        <div className="flex flex-1 flex-col gap-4 p-4 pt-4 overflow-auto">
          <PageTransition key={`${currentView}-${currentRegion}-${selectedTableId}`}>
            {currentView === "overview" ? (
              <Overview onNavigateToTables={(region) => {
                handleNavigate("list", region)
              }} />
            ) : currentView === "list" ? (
              <AllTables onViewTable={(tableId, tableName) => handleNavigate("detail", currentRegion, tableId, tableName)} region={currentRegion} />
            ) : currentView === "spinner-test" ? (
              <SpinnerTest />
            ) : (
              <TableDetail onBack={currentRegion ? () => handleNavigate("list", currentRegion) : undefined} tableId={selectedTableId} tableName={selectedTableName} />
            )}
          </PageTransition>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export function App() {
  return (
    <ToastProvider>
      <EditModeProvider>
        <AppContent />
      </EditModeProvider>
    </ToastProvider>
  )
}

export default App
