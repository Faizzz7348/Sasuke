import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  getTables,
  getTableById,
  createTable,
  addTableRow,
  updateTableRows,
  deleteTableRow,
  getOverview,
} from '../src/api/tables.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  const { url, method } = req

  try {
    // GET /api/overview
    if (url === '/api/overview' && method === 'GET') {
      const data = await getOverview()
      return res.json(data)
    }

    // GET /api/tables
    if (url?.startsWith('/api/tables') && method === 'GET' && !url.includes('/api/tables/')) {
      const region = (req.query.region as string) || 'selangor'
      const tables = await getTables(region)
      return res.json(tables)
    }

    // GET /api/tables/:id
    const getTableMatch = url?.match(/^\/api\/tables\/([^/]+)$/)
    if (getTableMatch && method === 'GET') {
      const table = await getTableById(getTableMatch[1])
      if (!table) {
        return res.status(404).json({ error: 'Table not found' })
      }
      return res.json(table)
    }

    // POST /api/tables
    if (url === '/api/tables' && method === 'POST') {
      const table = await createTable(req.body)
      return res.status(201).json(table)
    }

    // POST /api/tables/:id/data
    const postDataMatch = url?.match(/^\/api\/tables\/([^/]+)\/data$/)
    if (postDataMatch && method === 'POST') {
      const data = await addTableRow(postDataMatch[1], req.body)
      return res.status(201).json(data)
    }

    // PUT /api/tables/:id/data
    const putDataMatch = url?.match(/^\/api\/tables\/([^/]+)\/data$/)
    if (putDataMatch && method === 'PUT') {
      const result = await updateTableRows(putDataMatch[1], req.body.data)
      return res.json(result)
    }

    // DELETE /api/tables/:id/data/:rowId
    const deleteDataMatch = url?.match(/^\/api\/tables\/([^/]+)\/data\/([^/]+)$/)
    if (deleteDataMatch && method === 'DELETE') {
      const result = await deleteTableRow(deleteDataMatch[1], deleteDataMatch[2])
      return res.json(result)
    }

    // Route not found
    return res.status(404).json({ error: 'Not found' })
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
