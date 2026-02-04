import { useQuery } from '@tanstack/react-query'

export interface OverviewData {
  totalTables: number
  totalRows: number
  activeUsers: number
  completionRate: number
  recentActivity: Array<{
    id: string
    action: string
    table: string
    user: string
    timestamp: string
    region: string
  }>
}

export function useOverviewQuery() {
  return useQuery({
    queryKey: ['overview'],
    queryFn: async () => {
      const response = await fetch('/api/overview')
      if (!response.ok) {
        throw new Error('Failed to fetch overview data')
      }
      return response.json() as Promise<OverviewData>
    },
  })
}
