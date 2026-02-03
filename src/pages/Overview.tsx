import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  Users,
  Activity,
  TrendingUp,
  FileText,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { LoadingCard } from "@/components/ui/loading-card"
import { FadeIn } from "@/components/ui/page-transition"

interface StatCardProps {
  title: string
  value: string | number
  description: string
  icon: React.ReactNode
  trend?: {
    value: string
    isPositive: boolean
  }
}

const StatCard = ({ title, value, description, icon, trend }: StatCardProps) => {
  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        {trend && (
          <div
            className={`text-xs mt-2 flex items-center gap-1 font-medium ${
              trend.isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            <TrendingUp className="h-3 w-3" />
            {trend.value}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface RecentActivity {
  id: string
  action: string
  table: string
  user: string
  time: string
  status: "success" | "warning" | "info"
}

interface OverviewProps {
  onNavigateToTables?: (region?: "selangor" | "kl") => void
}

export function Overview({ onNavigateToTables }: OverviewProps) {
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [stats, setStats] = useState({
    totalTables: 0,
    totalRoutes: 0,
    activeUsers: 0,
    totalRecords: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOverviewData()
  }, [])

  const fetchOverviewData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/overview')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats || stats)
        setRecentActivities(data.recentActivities || [])
      }
    } catch (error) {
      console.error('Failed to fetch overview data:', error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Stats Cards */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <FadeIn delay={0}>
            <StatCard
              title="Total Tables"
              value={stats.totalTables}
              description="Active database tables"
              icon={<Table className="h-4 w-4" />}
              trend={{ value: "+2 this week", isPositive: true }}
            />
          </FadeIn>
          <FadeIn delay={100}>
            <StatCard
              title="Total Routes"
              value={stats.totalRoutes}
              description="Delivery routes managed"
              icon={<MapPin className="h-4 w-4" />}
              trend={{ value: "+12% from last month", isPositive: true }}
            />
          </FadeIn>
          <FadeIn delay={200}>
            <StatCard
              title="Active Users"
              value={stats.activeUsers}
              description="Currently online"
              icon={<Users className="h-4 w-4" />}
            />
          </FadeIn>
          <FadeIn delay={300}>
            <StatCard
              title="Total Records"
              value={stats.totalRecords.toLocaleString()}
              description="Data entries"
              icon={<FileText className="h-4 w-4" />}
              trend={{ value: "+847 today", isPositive: true }}
            />
          </FadeIn>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <FadeIn delay={400}>
          <Card className="col-span-4 card-hover">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest actions performed across all tables
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <div className="h-8 w-8 bg-muted rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity, idx) => (
                    <FadeIn key={activity.id} delay={450 + idx * 50}>
                      <div className="flex items-center justify-between hover:bg-muted/50 p-2 rounded-lg transition-colors">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full transition-transform hover:scale-110 ${
                              activity.status === "success"
                                ? "bg-green-100 dark:bg-green-900/30"
                                : activity.status === "warning"
                                ? "bg-yellow-100 dark:bg-yellow-900/30"
                                : "bg-blue-100 dark:bg-blue-900/30"
                            }`}
                          >
                            {activity.status === "success" ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                            ) : activity.status === "warning" ? (
                              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            ) : (
                              <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{activity.action}</p>
                            <p className="text-xs text-muted-foreground">
                              {activity.table} • {activity.user}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {activity.time}
                        </div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>

        {/* Quick Actions & Stats */}
        <FadeIn delay={500}>
          <Card className="col-span-3 card-hover">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                className="w-full justify-start hover:translate-x-1 transition-transform" 
                variant="outline" 
                onClick={() => onNavigateToTables?.("selangor")}
              >
                <Table className="mr-2 h-4 w-4" />
                View All Tables
              </Button>
              <Button 
                className="w-full justify-start hover:translate-x-1 transition-transform" 
                variant="outline" 
                onClick={() => onNavigateToTables?.("selangor")}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Manage Routes
              </Button>
              <Button className="w-full justify-start hover:translate-x-1 transition-transform" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
              <Button className="w-full justify-start hover:translate-x-1 transition-transform" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>

              {/* Mini Stats */}
              <div className="pt-4 mt-4 border-t space-y-3">
                <div className="flex items-center justify-between hover:bg-muted/50 p-2 rounded transition-colors">
                  <span className="text-sm text-muted-foreground">
                    Today's Updates
                  </span>
                  <span className="text-sm font-semibold">127</span>
                </div>
                <div className="flex items-center justify-between hover:bg-muted/50 p-2 rounded transition-colors">
                  <span className="text-sm text-muted-foreground">
                    Pending Reviews
                  </span>
                  <span className="text-sm font-semibold text-yellow-600">3</span>
                </div>
                <div className="flex items-center justify-between hover:bg-muted/50 p-2 rounded transition-colors">
                  <span className="text-sm text-muted-foreground">
                    Storage Used
                  </span>
                  <span className="text-sm font-semibold">45.2 GB</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  )
}
