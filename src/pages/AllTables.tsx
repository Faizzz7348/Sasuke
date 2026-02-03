import { useState, useEffect, useCallback } from "react"
import {
  Search,
  Plus,
  MoreVertical,
  FileText,
  Eye,
  Edit,
  Trash2,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import SelangorIcon from "@/assets/icon/960px-Flag_of_Selangor.svg.png"
import KLIcon from "@/assets/icon/kl-flag.png"
import { useEditMode } from "@/contexts/EditModeProvider"
import { LoadingTable } from "@/components/ui/loading-card"
import { FadeIn, SlideIn } from "@/components/ui/page-transition"
import { EmptyState } from "@/components/ui/empty-state"

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

interface AllTablesProps {
  onViewTable?: (tableId: string, tableName: string) => void
  region?: "selangor" | "kl"
}

export function AllTables({ onViewTable, region = "selangor" }: AllTablesProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const { isEditModeEnabled } = useEditMode()

  const regionName = region === "selangor" ? "Selangor" : "Kuala Lumpur"

  const fetchTables = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/tables?region=${region}`)
      if (response.ok) {
        const data = await response.json()
        setTables(data)
      } else {
        setError('Failed to fetch tables')
      }
    } catch (error) {
      console.error('Failed to fetch tables:', error)
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }, [region])

  useEffect(() => {
    fetchTables()
  }, [fetchTables])

  const handleCreateTable = async () => {
    try {
      setError(null)
      const response = await fetch('/api/tables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          region,
          createdBy: 'Admin User', // TODO: Get from auth context
        }),
      })

      if (response.ok) {
        setShowCreateModal(false)
        setFormData({ name: "", description: "" })
        fetchTables()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create table')
      }
    } catch (error) {
      console.error('Failed to create table:', error)
      setError('Failed to connect to server. Make sure the backend is running on port 3001.')
    }
  }

  const handleEditTable = async () => {
    if (!selectedTable) return
    try {
      setError(null)
      const response = await fetch(`/api/tables/${selectedTable.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
        }),
      })

      if (response.ok) {
        setShowEditModal(false)
        setFormData({ name: "", description: "" })
        setSelectedTable(null)
        fetchTables()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to update table')
      }
    } catch (error) {
      console.error('Failed to update table:', error)
      setError('Failed to connect to server.')
    }
  }

  const handleDeleteTable = async () => {
    if (!selectedTable) return
    try {
      setError(null)
      const response = await fetch(`/api/tables/${selectedTable.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setShowDeleteDialog(false)
        setSelectedTable(null)
        fetchTables()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to delete table')
      }
    } catch (error) {
      console.error('Failed to delete table:', error)
      setError('Failed to connect to server.')
    }
  }

  const openEditModal = (table: Table) => {
    setSelectedTable(table)
    setFormData({
      name: table.name,
      description: table.description || "",
    })
    setShowEditModal(true)
  }

  const openDeleteDialog = (table: Table) => {
    setSelectedTable(table)
    setShowDeleteDialog(true)
  }

  const filteredTables = tables.filter((table) =>
    table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (table.description && table.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (loading) {
    return <LoadingTable />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-600 dark:text-green-400"
      case "draft":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
      case "archived":
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400"
      default:
        return "bg-gray-500/10 text-gray-600"
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col gap-4 items-center">
          <div className="flex flex-col items-center gap-2">
            {region === "selangor" && (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg"></div>
                <img 
                  src={SelangorIcon} 
                  alt="Selangor Flag" 
                  className="h-14 w-20 object-cover rounded-lg border-2 border-gray-300/50 dark:border-gray-700 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl" 
                  style={{ 
                    imageRendering: '-webkit-optimize-contrast',
                    filter: 'contrast(1.15) saturate(1.1) brightness(1.05) drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
                    transform: 'perspective(1000px) rotateX(2deg)',
                  }}
                />
              </div>
            )}
            {region === "kl" && (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg"></div>
                <img 
                  src={KLIcon} 
                  alt="KL Flag" 
                  className="h-14 w-20 object-cover rounded-lg border-2 border-gray-300/50 dark:border-gray-700 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl" 
                  style={{ 
                    imageRendering: '-webkit-optimize-contrast',
                    filter: 'contrast(1.15) saturate(1.1) brightness(1.05) drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
                    transform: 'perspective(1000px) rotateX(2deg)',
                  }}
                />
              </div>
            )}
            <h1 className="text-2xl font-bold tracking-tight text-center bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">{regionName}</h1>
          </div>
          {isEditModeEnabled && (
            <Button className="gap-2 shadow-lg hover:shadow-xl transition-all" onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4" />
            Create New Table
          </Button>
          )}
        </div>
      </FadeIn>

      {/* Search and Filters */}
      <SlideIn direction="down" delay={100}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 transition-all focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </SlideIn>

      {/* Tables Grid */}
      {filteredTables.length === 0 ? (
        <FadeIn delay={200}>
          <EmptyState
            icon={<FileText className="h-16 w-16" />}
            title="No tables found"
            description={searchQuery ? "Try adjusting your search query" : "Create your first table to get started"}
            action={isEditModeEnabled ? {
              label: "Create Table",
              onClick: () => setShowCreateModal(true)
            } : undefined}
          />
        </FadeIn>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTables.map((table, idx) => (
            <FadeIn key={table.id} delay={200 + idx * 50}>
              <div className="group relative overflow-hidden rounded-lg border bg-card p-5 card-hover"
          >
            {isEditModeEnabled ? (
              <>
                {/* Edit Mode: Icons moved below timestamp */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-base">{table.name}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(
                        table.status
                      )}`}
                    >
                      {table.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">
                    {table.description}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Rows:</span>
                    <span className="ml-1 font-medium">
                      {table.rows.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Columns:</span>
                    <span className="ml-1 font-medium">{table.columns}</span>
                  </div>
                </div>

                {/* Admin User info and icons at bottom */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex flex-col text-xs text-muted-foreground mb-3">
                    <span>{table.createdBy}</span>
                    <span>{table.lastModified}</span>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => onViewTable?.(table.id, table.name)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => openEditModal(table)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => openDeleteDialog(table)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Normal Mode: Original layout */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-base">{table.name}</h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(
                          table.status
                        )}`}
                      >
                        {table.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">
                      {table.description}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => onViewTable?.(table.id, table.name)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Table
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditModal(table)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => openDeleteDialog(table)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Rows:</span>
                    <span className="ml-1 font-medium">
                      {table.rows.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Columns:</span>
                    <span className="ml-1 font-medium">{table.columns}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t flex items-center justify-between gap-2">
                  <div className="flex flex-col text-xs text-muted-foreground">
                    <span>{table.createdBy}</span>
                    <span>{table.lastModified}</span>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => onViewTable?.(table.id, table.name)}
                    className="gap-1.5 bg-orange-700 hover:bg-orange-800 text-white shadow-md shadow-orange-700/20 transition-all duration-200"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </Button>
                </div>
              </>
            )}
            </div>
            </FadeIn>
          ))}
        </div>
      )}

      {/* Error Message */}
      {/* Create New Table Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Table</DialogTitle>
            <DialogDescription>
              Create a new table for {regionName}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {error && (
              <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="table-name" className="text-sm font-medium">
                Table Name
              </label>
              <Input
                id="table-name"
                placeholder="Enter table name..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="table-description" className="text-sm font-medium">
                Description
              </label>
              <Input
                id="table-description"
                placeholder="Enter description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTable}
              disabled={!formData.name.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Table
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Table Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Table</DialogTitle>
            <DialogDescription>
              Update the table information.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {error && (
              <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="edit-table-name" className="text-sm font-medium">
                Table Name
              </label>
              <Input
                id="edit-table-name"
                placeholder="Enter table name..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-table-description" className="text-sm font-medium">
                Description
              </label>
              <Input
                id="edit-table-description"
                placeholder="Enter description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditModal(false)
                setFormData({ name: "", description: "" })
                setSelectedTable(null)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditTable}
              disabled={!formData.name.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              <Edit className="h-4 w-4 mr-2" />
              Update Table
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Table</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this table? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedTable && (
            <div className="py-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-semibold">{selectedTable.name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedTable.description}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {selectedTable.rows} rows · {selectedTable.columns} columns
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false)
                setSelectedTable(null)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteTable}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Table
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
