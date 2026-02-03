import { prisma } from '@/lib/prisma'

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
    
    return table
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

// POST /api/tables/:id/data - Add row to table
export async function addTableRow(tableId: string, rowData: any) {
  try {
    const tableData = await prisma.tableData.create({
      data: {
        tableId,
        code: rowData.code,
        location: rowData.location,
        delivery: rowData.delivery,
        lat: rowData.lat,
        lng: rowData.lng,
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
export async function updateTableRows(_tableId: string, rows: any[]) {
  try {
    // Use transaction to update all rows
    const updates = rows.map(row =>
      prisma.tableData.update({
        where: { id: row.id },
        data: {
          code: row.code,
          location: row.location,
          delivery: row.delivery,
          lat: row.lat,
          lng: row.lng,
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
    const recentActivities = await prisma.activity.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    return {
      stats: {
        totalTables,
        totalRoutes: totalRecords, // Using records as routes for now
        activeUsers: 8, // Placeholder
        totalRecords,
      },
      recentActivities: recentActivities.map(activity => ({
        id: activity.id,
        action: activity.action,
        table: activity.table,
        user: activity.user,
        status: activity.status,
        time: getRelativeTime(activity.createdAt),
      })),
    }
  } catch (error) {
    console.error('Error fetching overview:', error)
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
