import { Spinner, LoadingSpinner, FullPageLoader } from "@/components/ui/spinner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LoadingCard, LoadingTable } from "@/components/ui/loading-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { FadeIn, SlideIn, ScaleIn } from "@/components/ui/page-transition"

export function SpinnerTest() {
  const [showFullPage, setShowFullPage] = useState(false)

  return (
    <>
      {showFullPage && <FullPageLoader />}
      
      <div className="space-y-8 p-8 max-w-6xl mx-auto">
        <div className="animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            ✨ Animasi & Spinner Test
          </h1>
          <p className="text-muted-foreground mt-2">Tengok semua spinner bergerak smooth & cantik!</p>
        </div>
        
        <FadeIn delay={100}>
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>🎨 Spinner Sizes</CardTitle>
              <CardDescription>Berbagai saiz spinner yang smooth</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-around gap-8 flex-wrap">
              <div className="flex flex-col items-center gap-3">
                <Spinner size="sm" className="text-blue-500" />
                <p className="text-sm font-medium">Small</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <Spinner size="md" className="text-green-500" />
                <p className="text-sm font-medium">Medium</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <Spinner size="lg" className="text-purple-500" />
                <p className="text-sm font-medium">Large</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <Spinner size="xl" className="text-pink-500" />
                <p className="text-sm font-medium">Extra Large</p>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <SlideIn direction="up" delay={150}>
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>🔄 LoadingSpinner Component</CardTitle>
              <CardDescription>Spinner dengan text yang smooth</CardDescription>
            </CardHeader>
            <CardContent>
              <LoadingSpinner text="Sedang loading data..." />
            </CardContent>
          </Card>
        </SlideIn>

        <ScaleIn delay={200}>
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>💳 LoadingCard Component</CardTitle>
              <CardDescription>Card loading dengan animasi fade in</CardDescription>
            </CardHeader>
            <CardContent>
              <LoadingCard count={3} />
            </CardContent>
          </Card>
        </ScaleIn>

        <FadeIn delay={250}>
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>📊 LoadingTable Component</CardTitle>
              <CardDescription>Skeleton loading untuk table dengan stagger effect</CardDescription>
            </CardHeader>
            <CardContent>
              <LoadingTable />
            </CardContent>
          </Card>
        </FadeIn>

        <SlideIn direction="right" delay={300}>
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>🎭 Skeleton Components</CardTitle>
              <CardDescription>Skeleton dengan shimmer animation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
              <Skeleton className="h-32 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </CardContent>
          </Card>
        </SlideIn>

        <ScaleIn delay={350}>
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>🌈 Colored Spinners</CardTitle>
              <CardDescription>Spinner dengan berbagai warna</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="flex flex-col items-center gap-3 p-4 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors">
                  <Spinner size="lg" className="text-blue-500" />
                  <p className="text-sm font-medium">Blue</p>
                </div>
                <div className="flex flex-col items-center gap-3 p-4 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors">
                  <Spinner size="lg" className="text-green-500" />
                  <p className="text-sm font-medium">Green</p>
                </div>
                <div className="flex flex-col items-center gap-3 p-4 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors">
                  <Spinner size="lg" className="text-red-500" />
                  <p className="text-sm font-medium">Red</p>
                </div>
                <div className="flex flex-col items-center gap-3 p-4 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors">
                  <Spinner size="lg" className="text-purple-500" />
                  <p className="text-sm font-medium">Purple</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScaleIn>

        <FadeIn delay={400}>
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>🚀 Full Page Loader</CardTitle>
              <CardDescription>Loader yang cover seluruh page dengan backdrop blur</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Button 
                onClick={() => {
                  setShowFullPage(true)
                  setTimeout(() => setShowFullPage(false), 2000)
                }}
                className="hover:scale-105 transition-transform"
              >
                Show Full Page Loader (2s)
              </Button>
            </CardContent>
          </Card>
        </FadeIn>

        <div className="stagger-children grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="card-hover">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-2">⚡</div>
              <h3 className="font-semibold">Super Fast</h3>
              <p className="text-sm text-muted-foreground mt-2">Semua animasi optimized</p>
            </CardContent>
          </Card>
          <Card className="card-hover">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-2">🎨</div>
              <h3 className="font-semibold">Beautiful</h3>
              <p className="text-sm text-muted-foreground mt-2">Design yang cantik & smooth</p>
            </CardContent>
          </Card>
          <Card className="card-hover">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-2">✨</div>
              <h3 className="font-semibold">Smooth AF</h3>
              <p className="text-sm text-muted-foreground mt-2">60fps animations everywhere</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
