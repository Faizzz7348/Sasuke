import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  getTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
  addTableRow,
  updateTableRows,
  deleteTableRow,
  moveTableRows,
  getOverview,
  checkDuplicateCode,
} from './lib/tables.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { method } = req
  // Use URL API instead of url.parse to avoid deprecation warning
  const reqUrl = new URL(req.url || '/', `http://${req.headers.host}`)
  const path = reqUrl.pathname.replace(/^\/api/, '')

  console.log(`[API] ${method} ${path}`, { query: Object.fromEntries(reqUrl.searchParams) })

  try {
    // Health check
    if (path === '/health') {
      return res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
    }

    // GET /overview
    if (method === 'GET' && path === '/overview') {
      const data = await getOverview()
      return res.status(200).json(data)
    }

    // GET /tables or /tables/:id
    if (method === 'GET' && path?.startsWith('/tables')) {
      // Check for specific table ID
      const match = path.match(/^\/tables\/([^/?]+)$/)
      
      if (match && match[1]) {
        // GET /tables/:id
        console.log(`[API] Fetching table with ID: ${match[1]}`)
        const table = await getTableById(match[1])
        if (!table) {
          return res.status(404).json({ error: 'Table not found' })
        }
        return res.status(200).json(table)
      } else if (path === '/tables' || path === '/tables/') {
        // GET /tables
        console.log('[API] Fetching all tables...')
        const region = reqUrl.searchParams.get('region') || 'selangor'
        console.log('[API] Region:', region)
        const tables = await getTables(region)
        console.log(`[API] Found ${tables.length} tables`)
        return res.status(200).json(tables)
      }
    }

    // POST /tables
    if (method === 'POST' && path === '/tables') {
      const table = await createTable(req.body)
      return res.status(201).json(table)
    }

    // PUT /tables/:id
    const tableIdMatch = path?.match(/^\/tables\/([^/]+)$/)
    if (method === 'PUT' && tableIdMatch) {
      const table = await updateTable(tableIdMatch[1], req.body)
      return res.status(200).json(table)
    }

    // DELETE /tables/:id
    if (method === 'DELETE' && tableIdMatch) {
      const result = await deleteTable(tableIdMatch[1])
      return res.status(200).json(result)
    }

    // POST /tables/:id/data
    const addRowMatch = path?.match(/^\/tables\/([^/]+)\/data$/)
    if (method === 'POST' && addRowMatch) {
      const data = await addTableRow(addRowMatch[1], req.body)
      return res.status(201).json(data)
    }

    // PUT /tables/:id/data
    if (method === 'PUT' && addRowMatch) {
      const result = await updateTableRows(addRowMatch[1], req.body.data)
      return res.status(200).json(result)
    }

    // DELETE /tables/:id/data/:rowId
    const deleteRowMatch = path?.match(/^\/tables\/([^/]+)\/data\/([^/]+)$/)
    if (method === 'DELETE' && deleteRowMatch) {
      const result = await deleteTableRow(deleteRowMatch[1], deleteRowMatch[2])
      return res.status(200).json(result)
    }

    // POST /tables/:id/move - Move rows to another table
    const moveMatch = path?.match(/^\/tables\/([^/]+)\/move$/)
    if (method === 'POST' && moveMatch) {
      const result = await moveTableRows(moveMatch[1], req.body)
      return res.status(200).json(result)
    }

    // GET /tables/:id/check-duplicate?code=xxx
    const checkDuplicateMatch = path?.match(/^\/tables\/([^/]+)\/check-duplicate$/)
    if (method === 'GET' && checkDuplicateMatch) {
      const code = reqUrl.searchParams.get('code') || ''
      const rowId = reqUrl.searchParams.get('rowId') || undefined
      const result = await checkDuplicateCode(code, checkDuplicateMatch[1], rowId)
      return res.status(200).json(result)
    }

    // 404
    console.log('[API] Route not found:', path, method)
    return res.status(404).json({ error: 'Not found', path, method })

  } catch (error) {
    console.error('[API Error] Full error:', error)
    console.error('[API Error] Stack:', error instanceof Error ? error.stack : 'No stack')
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      path,
      method
    })
  }
}
