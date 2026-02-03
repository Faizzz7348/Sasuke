import { Spinner, LoadingSpinner } from "@/components/ui/spinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingCard } from "@/components/ui/loading-card"

export function SpinnerTest() {
  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">Spinner Test - Semua Kena Berpusing!</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Size Variants</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <Spinner size="sm" />
            <p className="text-xs">Small</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size="md" />
            <p className="text-xs">Medium</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size="lg" />
            <p className="text-xs">Large</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size="xl" />
            <p className="text-xs">Extra Large</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>LoadingSpinner Component</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSpinner text="Loading data..." />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>LoadingCard Component</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingCard />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Different Colors</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <Spinner size="lg" className="text-blue-500" />
            <p className="text-xs">Blue</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size="lg" className="text-green-500" />
            <p className="text-xs">Green</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size="lg" className="text-red-500" />
            <p className="text-xs">Red</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size="lg" className="text-purple-500" />
            <p className="text-xs">Purple</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
