import { useState, useEffect, useCallback } from "react"
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api'
import {
  Search,
  Download,
  Filter,
  Plus,
  Trash2,
  MoreVertical,
  ArrowUpDown,
  ChevronLeft,
  Map,
  MapPin,
  ChevronUp,
  ChevronDown,
  Settings,
  MoveRight,
  X,
  Save,
  Power,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
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
import { FileText } from "lucide-react"
import { useEditMode } from "@/contexts/EditModeProvider"

// Debounce helper
function useDebounce<T extends (...args: any[]) => any>(callback: T, delay: number) {
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null)

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      const newTimeoutId = setTimeout(() => {
        callback(...args)
      }, delay)
      setTimeoutId(newTimeoutId)
    },
    [callback, delay, timeoutId]
  )
}

interface TableData {
  id: string
  [key: string]: string | number
}

interface DuplicateInfo {
  hasDuplicate: boolean
  sameTable: boolean
  otherTables: boolean
  duplicateInfo: Array<{
    tableId: string
    tableName: string
    region: string
    location: string
  }>
}

interface TableDetailProps {
  onBack?: () => void
  tableId?: string
  tableName?: string
}

export function TableDetail({ onBack, tableId = "1", tableName: tableNameProp }: Partial<TableDetailProps> = {}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [data, setData] = useState<TableData[]>([])
  const [loading, setLoading] = useState(true)
  const [tableName, setTableName] = useState(tableNameProp || "Table Details")
  const [sortColumn, setSortColumn] = useState<string | null>("code")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [showMap, setShowMap] = useState(false)
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null)
  const [showColumnCustomize, setShowColumnCustomize] = useState(false)
  const [showActionsModal, setShowActionsModal] = useState(false)
  const [isMoveMode, setIsMoveMode] = useState(false)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [showMoveDialog, setShowMoveDialog] = useState(false)
  const [moveStep, setMoveStep] = useState<'region' | 'table'>('region')
  const [selectedRegion, setSelectedRegion] = useState<'selangor' | 'kl' | null>(null)
  const [availableTables, setAvailableTables] = useState<any[]>([])
  const [isMoving, setIsMoving] = useState(false)
  const [showAddRowDialog, setShowAddRowDialog] = useState(false)
  const [newRowData, setNewRowData] = useState({
    code: "",
    location: "",
    delivery: "",
    lat: "",
    lng: "",
  })
  const [editingData, setEditingData] = useState<TableData[]>([])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [rowToDelete, setRowToDelete] = useState<string | null>(null)
  const [showPowerDialog, setShowPowerDialog] = useState(false)
  const [selectedPowerRow, setSelectedPowerRow] = useState<TableData | null>(null)
  const { isEditModeEnabled } = useEditMode()
  
  // Duplicate detection states
  const [duplicateCheck, setDuplicateCheck] = useState<{[key: string]: DuplicateInfo}>({})
  const [checkingDuplicate, setCheckingDuplicate] = useState(false)
  const [duplicateWarning, setDuplicateWarning] = useState<string>("")

  const [columnConfig, setColumnConfig] = useState([
    { key: "code", label: "Code", visible: true },
    { key: "location", label: "Location", visible: true },
    { key: "delivery", label: "Delivery", visible: true },
    { key: "lat", label: "Latitude", visible: true },
    { key: "lng", label: "Longitude", visible: true },
  ])

  // Get columns based on current mode
  const getVisibleColumns = () => {
    if (isMoveMode) {
      // Move mode: only Code, Location, Delivery
      return columnConfig.filter(col => 
        ['code', 'location', 'delivery'].includes(col.key) && col.visible
      )
    } else if (isEditModeEnabled) {
      // Edit mode: all columns
      return columnConfig.filter(col => col.visible)
    } else {
      // Normal mode: Code, Location, Delivery (hide lat/lng)
      return columnConfig.filter(col => 
        ['code', 'location', 'delivery'].includes(col.key) && col.visible
      )
    }
  }

  const columns = getVisibleColumns()

  const fetchTableData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/tables/${tableId}`)
      if (response.ok) {
        const result = await response.json()
        setTableName(result.name || 'Table Details')
        setData(result.tableData || [])
      } else {
        console.error('Failed to fetch table:', response.status)
      }
    } catch (error) {
      console.error('Failed to fetch table data:', error)
    } finally {
      setLoading(false)
    }
  }, [tableId])

  useEffect(() => {
    fetchTableData()
  }, [fetchTableData])

  // Sync editingData with data when edit mode changes
  useEffect(() => {
    if (isEditModeEnabled && data.length > 0) {
      // Use the current sorted and filtered data
      const currentData = [...filteredData].sort((a, b) => {
        if (!sortColumn) return 0
        const aValue = a[sortColumn]
        const bValue = b[sortColumn]
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
        return 0
      })
      setEditingData(currentData)
    } else if (!isEditModeEnabled) {
      setEditingData([])
    }
  }, [isEditModeEnabled, data, searchQuery, sortColumn, sortDirection])

  // Reset move mode when global edit mode is disabled
  useEffect(() => {
    if (!isEditModeEnabled && isMoveMode) {
      setIsMoveMode(false)
      setSelectedRows(new Set())
    }
  }, [isEditModeEnabled, isMoveMode])

  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0
    
    const aValue = a[sortColumn]
    const bValue = b[sortColumn]
    
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(columnKey)
      setSortDirection("asc")
    }
  }

  const toggleColumnVisibility = (key: string) => {
    setColumnConfig(prev => 
      prev.map(col => 
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    )
  }

  const moveColumnUp = (index: number) => {
    if (index === 0) return
    setColumnConfig(prev => {
      const newConfig = [...prev]
      ;[newConfig[index - 1], newConfig[index]] = [newConfig[index], newConfig[index - 1]]
      return newConfig
    })
  }

  const moveColumnDown = (index: number) => {
    if (index === columnConfig.length - 1) return
    setColumnConfig(prev => {
      const newConfig = [...prev]
      ;[newConfig[index], newConfig[index + 1]] = [newConfig[index + 1], newConfig[index]]
      return newConfig
    })
  }

  const handleToggleMoveMode = () => {
    if (!isEditModeEnabled) return
    setIsMoveMode(!isMoveMode)
    setSelectedRows(new Set())
    setShowActionsModal(false)
  }

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedRows(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedRows.size === sortedData.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(sortedData.map(row => row.id)))
    }
  }

  const handleSelectRegion = async (region: 'selangor' | 'kl') => {
    setSelectedRegion(region)
    try {
      const response = await fetch(`/api/tables?region=${region}`)
      if (response.ok) {
        const tables = await response.json()
        // Filter out current table
        setAvailableTables(tables.filter((t: any) => t.id !== tableId))
        setMoveStep('table')
      }
    } catch (error) {
      console.error('Failed to fetch tables:', error)
    }
  }

  const handleMoveRows = async (destinationTableId: string) => {
    if (selectedRows.size === 0) return
    
    setIsMoving(true)
    try {
      const rowsToMove = Array.from(selectedRows)
      const response = await fetch(`/api/tables/${tableId}/move`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destinationTableId,
          rowIds: rowsToMove,
        }),
      })

      if (response.ok) {
        // Refresh table data
        await fetchTableData()
        setShowMoveDialog(false)
        setIsMoveMode(false)
        setSelectedRows(new Set())
        setMoveStep('region')
        setSelectedRegion(null)
      }
    } catch (error) {
      console.error('Failed to move rows:', error)
    } finally {
      setIsMoving(false)
    }
  }

  const handleCancelMove = () => {
    setShowMoveDialog(false)
    setMoveStep('region')
    setSelectedRegion(null)
    setAvailableTables([])
  }

  const handleAddRow = async () => {
    try {
      const response = await fetch(`/api/tables/${tableId}/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRowData),
      })

      if (response.ok) {
        setNewRowData({
          code: "",
          location: "",
          delivery: "",
          lat: "",
          lng: "",
        })
        setShowAddRowDialog(false)
        fetchTableData()
      }
    } catch (error) {
      console.error('Failed to add row:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    // Validate numeric only for code field
    if (field === 'code') {
      // Remove non-numeric characters
      value = value.replace(/[^0-9]/g, '')
    }
    
    setNewRowData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Check for duplicates when code changes (with debounce)
    if (field === 'code' && value) {
      debouncedCheckDuplicate(value)
    } else if (field === 'code' && !value) {
      setDuplicateWarning("")
      setDuplicateCheck(prev => ({ ...prev, newRow: { hasDuplicate: false, sameTable: false, otherTables: false, duplicateInfo: [] } }))
    }
  }

  const checkDuplicate = async (code: string, rowId?: string) => {
    if (!code) return
    
    setCheckingDuplicate(true)
    try {
      const response = await fetch(
        `/api/tables/${tableId}/check-duplicate?code=${encodeURIComponent(code)}${rowId ? `&rowId=${rowId}` : ''}`
      )
      if (response.ok) {
        const result: DuplicateInfo = await response.json()
        
        // Set duplicate info
        const key = rowId || 'newRow'
        setDuplicateCheck(prev => ({ ...prev, [key]: result }))
        
        // Set warning message
        if (result.hasDuplicate) {
          if (result.sameTable) {
            setDuplicateWarning(`⚠️ Duplicate! This code already exists in this table.`)
          } else if (result.otherTables && result.duplicateInfo.length > 0) {
            const tables = result.duplicateInfo.map(d => `${d.tableName} (${d.region})`).join(', ')
            setDuplicateWarning(`⚠️ Duplicate! This code already exists in: ${tables}`)
          }
        } else {
          setDuplicateWarning("")
        }
      }
    } catch (error) {
      console.error('Failed to check duplicate:', error)
    } finally {
      setCheckingDuplicate(false)
    }
  }

  // Debounced version of checkDuplicate
  const debouncedCheckDuplicate = useDebounce(checkDuplicate, 500)

  const handleEditCell = (rowId: string, field: string, value: string) => {
    // Validate numeric only for code field
    if (field === 'code') {
      value = value.replace(/[^0-9]/g, '')
    }
    
    setEditingData(prev =>
      prev.map(row =>
        row.id === rowId ? { ...row, [field]: value } : row
      )
    )
    
    // Check for duplicates when code changes (with debounce)
    if (field === 'code' && value) {
      debouncedCheckDuplicate(value, rowId)
    } else if (field === 'code' && !value) {
      setDuplicateCheck(prev => {
        const newCheck = { ...prev }
        delete newCheck[rowId]
        return newCheck
      })
    }
  }

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`/api/tables/${tableId}/data`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: editingData }),
      })

      if (response.ok) {
        fetchTableData()
      }
    } catch (error) {
      console.error('Failed to save edits:', error)
    }
  }

  const handleDeleteRow = async () => {
    if (rowToDelete) {
      try {
        const response = await fetch(`/api/tables/${tableId}/data/${rowToDelete}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setEditingData(prev => prev.filter(row => row.id !== rowToDelete))
          setShowDeleteDialog(false)
          setRowToDelete(null)
          fetchTableData()
        }
      } catch (error) {
        console.error('Failed to delete row:', error)
      }
    }
  }

  const confirmDelete = (rowId: string) => {
    setRowToDelete(rowId)
    setShowDeleteDialog(true)
  }

  const handlePowerClick = (row: TableData) => {
    setSelectedPowerRow(row)
    setShowPowerDialog(true)
  }

  const handlePowerOff = async (_e?: React.MouseEvent) => {
    if (!selectedPowerRow) return
    
    try {
      // Add your power off logic here
      console.log('Power off row:', selectedPowerRow)
      
      // Close dialog
      setShowPowerDialog(false)
      setSelectedPowerRow(null)
    } catch (error) {
      console.error('Failed to power off:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading table data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 mt-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={onBack}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold tracking-tight">{tableName}</h1>
            <p className="text-muted-foreground mt-1">
              {sortedData.length} rows · {columns.length} columns
            </p>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="flex flex-col gap-4">
        <div className={`rounded-lg border bg-card overflow-hidden transition-all duration-300 ${showMap ? 'h-[400px] opacity-100' : 'h-0 opacity-0 border-0'}`}>
          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '400px' }}
              center={{ lat: 3.1412, lng: 101.6865 }}
              zoom={11}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
              }}
            >
              {data.map((row) => {
                const lat = parseFloat(row.lat?.toString() || "0")
                const lng = parseFloat(row.lng?.toString() || "0")
                
                if (!lat || !lng) return null
                
                const coords = { lat, lng }

                return (
                  <Marker
                    key={row.id}
                    position={coords}
                    onClick={() => setSelectedMarker(row.id)}
                    title={row.location?.toString() || ""}
                  >
                    {selectedMarker === row.id && (
                      <InfoWindow
                        onCloseClick={() => setSelectedMarker(null)}
                      >
                        <div className="p-2">
                          <h3 className="font-semibold text-sm">{row.location}</h3>
                          <p className="text-xs text-gray-600 mt-1">
                            Code: {row.code}
                          </p>
                          <p className="text-xs text-gray-600">
                            Delivery: {row.delivery}
                          </p>
                        </div>
                      </InfoWindow>
                    )}
                  </Marker>
                )
              })}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search in table..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {isMoveMode && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-orange-100 dark:bg-orange-900/20 border border-orange-300 dark:border-orange-700">
            <MoveRight className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
              {selectedRows.size} selected
            </span>
          </div>
        )}
        {isMoveMode ? (
          <>
            <Button
              onClick={() => setShowMoveDialog(true)}
              disabled={selectedRows.size === 0}
              className="gap-2 bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-500/20 transition-all duration-200"
            >
              <MoveRight className="h-4 w-4" />
              Move to Table
            </Button>
            <Button
              onClick={handleToggleMoveMode}
              variant="outline"
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </>
        ) : isEditModeEnabled ? (
          <>
            <Button 
              onClick={() => setShowActionsModal(true)}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all duration-200"
            >
              <MoreVertical className="h-4 w-4" />
              Action
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="gap-2 bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-500/20 transition-all duration-200"
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button
              onClick={() => setEditingData([...data])}
              variant="outline"
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Reset
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => setShowMap(!showMap)}
              className={`gap-2 text-white transition-all duration-200 ${
                showMap 
                  ? "bg-red-600 hover:bg-red-700 shadow-md shadow-red-500/20" 
                  : "bg-green-600 hover:bg-green-700 shadow-md shadow-green-500/20"
              }`}
            >
              {showMap ? <MapPin className="h-4 w-4" /> : <Map className="h-4 w-4" />}
              {showMap ? "Hide Map" : "Show Map"}
            </Button>
            <Button 
              onClick={() => setShowActionsModal(true)}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all duration-200"
            >
              <MoreVertical className="h-4 w-4" />
              Actions
            </Button>
          </>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full min-w-[800px]">
            <thead className="border-b bg-muted/50">
              <tr>
                {isMoveMode && (
                  <th className="w-12 px-4 py-3 text-center sticky left-0 bg-muted/50 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 cursor-pointer"
                      checked={selectedRows.size === sortedData.length && sortedData.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                )}
                {!isMoveMode && (
                  <th className="w-16 px-4 py-3 text-center text-sm font-medium sticky left-0 bg-muted/50 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    No
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-4 py-3 text-center text-sm font-medium cursor-pointer hover:bg-muted/80 transition-colors whitespace-nowrap"
                    onClick={() => handleSort(column.key)}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {column.label}
                      <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                  </th>
                ))}
                {!isMoveMode && (
                  <th className="w-32 px-4 py-3 text-center sticky right-0 bg-muted/50 z-10 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {(isEditModeEnabled ? editingData : sortedData).map((row, index) => (
                <tr
                  key={row.id}
                  className={`border-b transition-colors hover:bg-muted/50 ${
                    index % 2 === 0 ? "bg-transparent" : "bg-muted/20"
                  } ${
                    isMoveMode && selectedRows.has(row.id) ? "bg-orange-50 dark:bg-orange-900/20" : ""
                  } ${
                    isEditModeEnabled && !isMoveMode ? "bg-blue-50/30 dark:bg-blue-900/10" : ""
                  }`}
                >
                  {isMoveMode && (
                    <td className="px-4 py-3 text-center sticky left-0 bg-inherit z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 cursor-pointer"
                        checked={selectedRows.has(row.id)}
                        onChange={() => handleSelectRow(row.id)}
                      />
                    </td>
                  )}
                  {!isMoveMode && (
                    <td className="px-4 py-3 text-sm text-center font-medium text-muted-foreground sticky left-0 bg-inherit z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      {index + 1}
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 text-sm text-center whitespace-nowrap">
                      {isEditModeEnabled && !isMoveMode ? (
                        column.key === "delivery" ? (
                          <Select
                            value={row[column.key]?.toString() || ""}
                            onValueChange={(value) => handleEditCell(row.id, column.key, value)}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="Select delivery" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Daily">Daily</SelectItem>
                              <SelectItem value="Weekday">Weekday</SelectItem>
                              <SelectItem value="Alt 1">Alt 1</SelectItem>
                              <SelectItem value="Alt 2">Alt 2</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : column.key === "code" ? (
                          <div className="relative">
                            <Input
                              value={row[column.key]?.toString() || ""}
                              onChange={(e) => handleEditCell(row.id, column.key, e.target.value)}
                              className={`h-8 text-center ${
                                duplicateCheck[row.id]?.sameTable 
                                  ? 'border-red-500 border-2 bg-red-50 dark:bg-red-900/20' 
                                  : duplicateCheck[row.id]?.otherTables
                                  ? 'border-yellow-500 border-2 bg-yellow-50 dark:bg-yellow-900/20'
                                  : ''
                              }`}
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                            />
                            {duplicateCheck[row.id]?.hasDuplicate && (
                              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 z-10 whitespace-nowrap">
                                <div className={`text-xs px-2 py-1 rounded shadow-lg ${
                                  duplicateCheck[row.id]?.sameTable
                                    ? 'bg-red-100 text-red-800 border border-red-300'
                                    : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                                }`}>
                                  {duplicateCheck[row.id]?.sameTable 
                                    ? '⚠️ Duplicate in this table!' 
                                    : `⚠️ Duplicate in: ${duplicateCheck[row.id]?.duplicateInfo.map(d => d.tableName).join(', ')}`
                                  }
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <Input
                            value={row[column.key]?.toString() || ""}
                            onChange={(e) => handleEditCell(row.id, column.key, e.target.value)}
                            className="h-8 text-center"
                          />
                        )
                      ) : (
                        <span className="text-foreground">
                          {row[column.key]}
                        </span>
                      )}
                    </td>
                  ))}
                  {!isMoveMode && (
                    <td className="px-4 py-3 text-center sticky right-0 bg-inherit z-10 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      <div className="flex items-center justify-center gap-1">
                        {isEditModeEnabled && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => confirmDelete(row.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handlePowerClick(row)}
                        >
                          <Power className="h-4 w-4" />
                          <span className="sr-only">Power</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Info className="h-4 w-4" />
                          <span className="sr-only">Info</span>
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {(isEditModeEnabled ? editingData : sortedData).length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold">No results found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search query
            </p>
          </div>
        )}

        {/* Pagination */}
        {(isEditModeEnabled ? editingData : sortedData).length > 0 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">1-{(isEditModeEnabled ? editingData : sortedData).length}</span> of{" "}
              <span className="font-medium">{data.length}</span> results
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Actions Modal */}
      <Dialog open={showActionsModal} onOpenChange={setShowActionsModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Actions</DialogTitle>
            <DialogDescription>
              Choose an action to perform on this table.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2 py-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12"
              onClick={() => {
                setShowActionsModal(false)
                // Handle filter action
              }}
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12"
              onClick={() => {
                setShowActionsModal(false)
                // Handle export action
              }}
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12"
              onClick={() => {
                setShowActionsModal(false)
                setShowColumnCustomize(true)
              }}
            >
              <Settings className="h-4 w-4" />
              <span>Column Customize</span>
            </Button>
            
            <div className="border-t my-2"></div>
            
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12"
              onClick={() => {
                setShowActionsModal(false)
                setShowAddRowDialog(true)
              }}
              disabled={!isEditModeEnabled}
            >
              <Plus className="h-4 w-4" />
              <span>Add Row</span>
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12"
              onClick={handleToggleMoveMode}
              disabled={!isEditModeEnabled}
            >
              <MoveRight className="h-4 w-4" />
              <span>Move Location</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Column Customize Modal */}
      <Dialog open={showColumnCustomize} onOpenChange={setShowColumnCustomize}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Customize Columns</DialogTitle>
            <DialogDescription>
              Toggle column visibility and reorder columns to customize your table view.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2 max-h-[400px] overflow-y-auto py-4">
            {columnConfig
              .filter(column => {
                // Filter columns based on mode
                if (!isEditModeEnabled && ['lat', 'lng'].includes(column.key)) {
                  return false // Hide lat/lng in normal mode
                }
                return true
              })
              .map((column, index) => (
              <div
                key={column.key}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <input
                  type="checkbox"
                  id={`column-${column.key}`}
                  checked={column.visible}
                  onChange={() => toggleColumnVisibility(column.key)}
                  className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                />
                <label
                  htmlFor={`column-${column.key}`}
                  className="flex-1 text-sm font-medium cursor-pointer"
                >
                  {column.label}
                </label>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => moveColumnUp(index)}
                    disabled={index === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => moveColumnDown(index)}
                    disabled={index === columnConfig.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowColumnCustomize(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => setShowColumnCustomize(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Apply Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Row Dialog */}
      <Dialog open={showAddRowDialog} onOpenChange={(_open) => {
        setShowAddRowDialog(_open)
        if (!_open) {
          // Clear states when dialog closes
          setDuplicateWarning("")
          setDuplicateCheck(prev => {
            const newCheck = { ...prev }
            delete newCheck.newRow
            return newCheck
          })
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Row</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new row to the table.
            </DialogDescription>
          </DialogHeader>
          
          {/* Duplicate Warning Banner */}
          {duplicateWarning && (
            <div className={`p-3 rounded-md border ${
              duplicateCheck.newRow?.sameTable 
                ? 'bg-red-50 border-red-300 text-red-800 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300' 
                : 'bg-yellow-50 border-yellow-300 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-300'
            }`}>
              <div className="flex items-start gap-2">
                <span className="text-lg">⚠️</span>
                <div className="flex-1">
                  <p className="font-medium text-sm">{duplicateWarning}</p>
                  {duplicateCheck.newRow?.duplicateInfo && duplicateCheck.newRow.duplicateInfo.length > 0 && (
                    <ul className="mt-2 text-xs space-y-1">
                      {duplicateCheck.newRow.duplicateInfo.map((info, i) => (
                        <li key={i}>
                          • <strong>{info.tableName}</strong> ({info.region}) - {info.location}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Code (Numeric Only)</label>
              <Input
                placeholder="Enter code (numbers only)" 
                value={newRowData.code}
                onChange={(e) => handleInputChange("code", e.target.value)}
                className={`${
                  duplicateCheck.newRow?.sameTable 
                    ? 'border-red-500 border-2 bg-red-50 dark:bg-red-900/20' 
                    : duplicateCheck.newRow?.otherTables
                    ? 'border-yellow-500 border-2 bg-yellow-50 dark:bg-yellow-900/20'
                    : ''
                }`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
              />
              {checkingDuplicate && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="inline-block animate-spin">⏳</span> Checking for duplicates...
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input
                placeholder="Enter location name"
                value={newRowData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Delivery</label>
              <Select
                value={newRowData.delivery}
                onValueChange={(value) => handleInputChange("delivery", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select delivery schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekday">Weekday</SelectItem>
                  <SelectItem value="Alt 1">Alt 1</SelectItem>
                  <SelectItem value="Alt 2">Alt 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Latitude</label>
                <Input
                  placeholder="e.g., 3.1569"
                  value={newRowData.lat}
                  onChange={(e) => handleInputChange("lat", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Longitude</label>
                <Input
                  placeholder="e.g., 101.7123"
                  value={newRowData.lng}
                  onChange={(e) => handleInputChange("lng", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddRowDialog(false)
                setNewRowData({
                  code: "",
                  location: "",
                  delivery: "",
                  lat: "",
                  lng: "",
                })
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddRow}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!newRowData.code || !newRowData.location || duplicateCheck.newRow?.sameTable}
            >
              Add Row
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Row</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this row? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false)
                setRowToDelete(null)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteRow}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Power Off Dialog */}
      <Dialog open={showPowerDialog} onOpenChange={setShowPowerDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Power className="h-5 w-5 text-orange-600" />
              Power Off Confirmation
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to power off this location?
            </DialogDescription>
          </DialogHeader>
          
          {selectedPowerRow && (
            <div className="space-y-3 py-4">
              <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Code:</span>
                  <span className="text-sm font-semibold">{selectedPowerRow.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Location:</span>
                  <span className="text-sm font-semibold">{selectedPowerRow.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Delivery:</span>
                  <span className="text-sm font-semibold">{selectedPowerRow.delivery}</span>
                </div>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                <p className="text-sm text-orange-800 dark:text-orange-300 flex items-start gap-2">
                  <span className="text-lg">⚠️</span>
                  <span>This location will be temporarily disabled and won't appear in active routes.</span>
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowPowerDialog(false)
                setSelectedPowerRow(null)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePowerOff}
              className="bg-orange-600 hover:bg-orange-700 text-white gap-2"
            >
              <Power className="h-4 w-4" />
              Power Off
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Move to Table Dialog */}
      <Dialog open={showMoveDialog} onOpenChange={handleCancelMove}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {moveStep === 'region' ? 'Select Region' : 'Select Destination Table'}
            </DialogTitle>
            <DialogDescription>
              {moveStep === 'region' 
                ? `Moving ${selectedRows.size} selected row${selectedRows.size !== 1 ? 's' : ''}. Choose a region first.`
                : `Select the destination table in ${selectedRegion === 'selangor' ? 'Selangor' : 'Kuala Lumpur'}.`
              }
            </DialogDescription>
          </DialogHeader>
          
          {isMoving ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Moving rows...</p>
            </div>
          ) : moveStep === 'region' ? (
            <div className="space-y-2 py-4">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12"
                onClick={() => handleSelectRegion('selangor')}
              >
                <MapPin className="h-4 w-4" />
                <span>Selangor</span>
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12"
                onClick={() => handleSelectRegion('kl')}
              >
                <MapPin className="h-4 w-4" />
                <span>Kuala Lumpur</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-2 py-4 max-h-[400px] overflow-y-auto">
              {availableTables.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No available tables in {selectedRegion === 'selangor' ? 'Selangor' : 'Kuala Lumpur'}
                </div>
              ) : (
                availableTables.map((table) => (
                  <Button
                    key={table.id}
                    variant="outline"
                    className="w-full justify-start gap-3 h-12"
                    onClick={() => handleMoveRows(table.id)}
                  >
                    <FileText className="h-4 w-4" />
                    <div className="flex flex-col items-start">
                      <span>{table.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {table.rows} rows
                      </span>
                    </div>
                  </Button>
                ))
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            {moveStep === 'table' && !isMoving && (
              <Button
                variant="outline"
                onClick={() => {
                  setMoveStep('region')
                  setSelectedRegion(null)
                }}
              >
                Back
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleCancelMove}
              disabled={isMoving}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
