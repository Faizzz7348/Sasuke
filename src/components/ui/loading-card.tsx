import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"

export function LoadingCard({ count = 1 }: { count?: number }) {
  if (count > 1) {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <Card 
            key={i} 
            className="animate-fade-in transition-all duration-300 hover:shadow-lg"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <CardContent className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <Spinner size="lg" />
                <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <Card className="animate-fade-in transition-all duration-300 hover:shadow-lg">
      <CardContent className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function LoadingTable() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>
      <div className="rounded-lg border transition-all duration-300">
        <div className="space-y-3 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={i} 
              className="flex items-center justify-between gap-4 animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-3 w-[300px]" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
