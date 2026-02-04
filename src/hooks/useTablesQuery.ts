import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface Table {
  id: string
  name: string
  description: string
  rows: number
  columns: number
  lastModified: string
  createdBy: string
  status: "active" | "archived" | "draft"
}

export function useTablesQuery(region: "selangor" | "kl") {
  return useQuery({
    queryKey: ['tables', region],
    queryFn: async () => {
      const response = await fetch(`/api/tables?region=${region}`)
      if (!response.ok) {
        throw new Error('Failed to fetch tables')
      }
      return response.json() as Promise<Table[]>
    },
  })
}

export function useCreateTableMutation() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: { name: string; description: string; region: string; createdBy: string }) => {
      const response = await fetch('/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error('Failed to create table')
      }
      return response.json()
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tables', variables.region] })
      queryClient.invalidateQueries({ queryKey: ['overview'] })
    },
  })
}

export function useUpdateTableMutation() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Table> }) => {
      const response = await fetch(`/api/tables/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error('Failed to update table')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
      queryClient.invalidateQueries({ queryKey: ['overview'] })
    },
  })
}

export function useDeleteTableMutation() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/tables/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete table')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
      queryClient.invalidateQueries({ queryKey: ['overview'] })
    },
  })
}
