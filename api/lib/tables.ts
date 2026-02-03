import { prisma } from './prisma.js'

// GET /api/tables - Fetch all tables for a region
export async function getTables(region: string) {
  try {
    const tables = await prisma.table.findMany({
      where: { region },
      include: {
        tableData: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })
    
    return tables.map(table => ({
      ...table,
      rows: table.tableData.length,
      columns: 5, // Fixed columns for now
      lastModified: getRelativeTime(table.updatedAt),
    }))
  } catch (error) {
    console.error('Error fetching tables:', error)
    throw error
  }
}

// GET /api/tables/:id - Fetch single table with data
export async function getTableById(id: string) {
  try {
    const table = await prisma.table.findUnique({
      where: { id },
      include: {
        tableData: true,
      },
    })
    
    if (!table) {
      return null
    }
    
    return {
      id: table.id,
      name: table.name,
      description: table.description,
      region: table.region,
      status: table.status,
      createdBy: table.createdBy,
      tableData: table.tableData.map(row => ({
        id: row.id,
        code: row.code,
        location: row.location,
        delivery: row.delivery,
        lat: row.lat,
        lng: row.lng,
      })),
    }
  } catch (error) {
    console.error('Error fetching table:', error)
    throw error
  }
}

// POST /api/tables - Create new table
export async function createTable(data: {
  name: string
  description?: string
  region: string
  createdBy: string
}) {
  try {
    const table = await prisma.table.create({
      data: {
        name: data.name,
        description: data.description,
        region: data.region,
        createdBy: data.createdBy,
        status: 'active',
      },
    })
    
    return table
  } catch (error) {
    console.error('Error creating table:', error)
    throw error
  }
}

// PUT /api/tables/:id - Update table
export async function updateTable(id: string, data: {
  name?: string
  description?: string
  status?: string
}) {
  try {
    const table = await prisma.table.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        status: data.status,
      },
    })
    
    return table
  } catch (error) {
    console.error('Error updating table:', error)
    throw error
  }
}

// DELETE /api/tables/:id - Delete table
export async function deleteTable(id: string) {
  try {
    // Delete all table data first
    await prisma.tableData.deleteMany({
      where: { tableId: id },
    })
    
    // Then delete the table
    await prisma.table.delete({
      where: { id },
    })
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting table:', error)
    throw error
  }
}

// POST /api/tables/:id/move - Move rows to another table
export async function moveTableRows(sourceTableId: string, data: {
  destinationTableId: string
  rowIds: string[]
}) {
  try {
    const { destinationTableId, rowIds } = data
    
    // Fetch rows to move
    const rowsToMove = await prisma.tableData.findMany({
      where: {
        id: { in: rowIds },
        tableId: sourceTableId,
      },
    })
    
    if (rowsToMove.length === 0) {
      throw new Error('No rows found to move')
    }
    
    // Use transaction to ensure atomicity
    await prisma.$transaction(async (tx) => {
      // Create new rows in destination table
      await Promise.all(
        rowsToMove.map(row =>
          tx.tableData.create({
            data: {
              tableId: destinationTableId,
              code: row.code,
              location: row.location,
              delivery: row.delivery,
              lat: row.lat,
              lng: row.lng,
              data: row.data,
            },
          })
        )
      )
      
      // Delete rows from source table
      await tx.tableData.deleteMany({
        where: {
          id: { in: rowIds },
        },
      })
    })
    
    return { success: true, movedCount: rowsToMove.length }
  } catch (error) {
    console.error('Error moving table rows:', error)
    throw error
  }
}

interface TableRowData {
  id?: string
  code: string
  location: string
  delivery: string
  lat: number
  lng: number
  [key: string]: string | number | undefined
}

// POST /api/tables/:id/data - Add row to table
export async function addTableRow(tableId: string, rowData: TableRowData) {
  try {
    // Check if table exists first
    const table = await prisma.table.findUnique({
      where: { id: tableId }
    })
    
    if (!table) {
      throw new Error(`Table with id ${tableId} not found`)
    }
    
    const tableData = await prisma.tableData.create({
      data: {
        tableId,
        code: rowData.code,
        location: rowData.location,
        delivery: rowData.delivery,
        lat: rowData.lat.toString(),
        lng: rowData.lng.toString(),
        data: rowData,
      },
    })
    
    // Update table row count
    await prisma.table.update({
      where: { id: tableId },
      data: {
        rows: {
          increment: 1,
        },
      },
    })
    
    return tableData
  } catch (error) {
    console.error('Error adding table row:', error)
    throw error
  }
}

// PUT /api/tables/:id/data - Update multiple rows
export async function updateTableRows(_tableId: string, rows: TableRowData[]) {
  try {
    // Use transaction to update all rows
    const updates = rows.map(row =>
      prisma.tableData.update({
        where: { id: row.id },
        data: {
          code: row.code,
          location: row.location,
          delivery: row.delivery,
          lat: row.lat.toString(),
          lng: row.lng.toString(),
          data: row,
        },
      })
    )
    
    await prisma.$transaction(updates)
    
    return { success: true }
  } catch (error) {
    console.error('Error updating table rows:', error)
    throw error
  }
}

// DELETE /api/tables/:id/data/:rowId - Delete a row
export async function deleteTableRow(tableId: string, rowId: string) {
  try {
    await prisma.tableData.delete({
      where: { id: rowId },
    })
    
    // Update table row count
    await prisma.table.update({
      where: { id: tableId },
      data: {
        rows: {
          decrement: 1,
        },
      },
    })
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting table row:', error)
    throw error
  }
}

// GET /api/overview - Get overview statistics
export async function getOverview() {
  try {
    const totalTables = await prisma.table.count()
    const totalRecords = await prisma.tableData.count()
    
    // Get recent tables instead of activities (Activity table doesn't exist)
    const recentTables = await prisma.table.findMany({
      take: 5,
      orderBy: {
        updatedAt: 'desc',
      },
    })
    
    return {
      stats: {
        totalTables,
        totalRoutes: totalRecords, // Using records as routes for now
        activeUsers: 8, // Placeholder
        totalRecords,
      },
      recentActivities: recentTables.map(table => ({
        id: table.id,
        action: 'Updated table',
        table: table.name,
        user: table.createdBy,
        status: table.status,
        time: getRelativeTime(table.updatedAt),
      })),
    }
  } catch (error) {
    console.error('Error fetching overview:', error)
    throw error
  }
}

// Check for duplicate code across all tables
export async function checkDuplicateCode(code: string, currentTableId?: string, currentRowId?: string) {
  try {
    // Find all rows with the same code
    const duplicates = await prisma.tableData.findMany({
      where: {
        code: code,
        // Exclude the current row if editing
        ...(currentRowId && { id: { not: currentRowId } }),
      },
      include: {
        table: {
          select: {
            id: true,
            name: true,
            region: true,
          },
        },
      },
    })
    
    // Separate duplicates by same table and other tables
    const sameTableDuplicates = duplicates.filter(d => d.tableId === currentTableId)
    const otherTableDuplicates = duplicates.filter(d => d.tableId !== currentTableId)
    
    return {
      hasDuplicate: duplicates.length > 0,
      sameTable: sameTableDuplicates.length > 0,
      otherTables: otherTableDuplicates.length > 0,
      duplicateInfo: otherTableDuplicates.map(d => ({
        tableId: d.table.id,
        tableName: d.table.name,
        region: d.table.region,
        location: d.location,
      })),
    }
  } catch (error) {
    console.error('Error checking duplicate code:', error)
    throw error
  }
}

// Helper function to get relative time
function getRelativeTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  return 'Just now'
}
