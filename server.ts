import express, { Request, Response } from 'express'
import cors from 'cors'
import {
  getTables,
  getTableById,
  createTable,
  addTableRow,
  updateTableRows,
  deleteTableRow,
  getOverview,
} from './src/api/tables'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Routes

// GET /api/overview
app.get('/api/overview', async (_req: Request, res: Response) => {
  try {
    const data = await getOverview()
    res.json(data)
  } catch {
    res.status(500).json({ error: 'Failed to fetch overview data' })
  }
})

// GET /api/tables
app.get('/api/tables', async (req: Request, res: Response) => {
  try {
    const region = req.query.region as string || 'selangor'
    const tables = await getTables(region)
    res.json(tables)
  } catch {
    res.status(500).json({ error: 'Failed to fetch tables' })
  }
})

// GET /api/tables/:id
app.get('/api/tables/:id', async (req: Request, res: Response) => {
  try {
    const table = await getTableById(req.params.id as string)
    if (!table) {
      return res.status(404).json({ error: 'Table not found' })
    }
    res.json(table)
  } catch {
    res.status(500).json({ error: 'Failed to fetch table' })
  }
})

// POST /api/tables
app.post('/api/tables', async (req: Request, res: Response) => {
  try {
    const table = await createTable(req.body)
    res.status(201).json(table)
  } catch {
    res.status(500).json({ error: 'Failed to create table' })
  }
})

// POST /api/tables/:id/data
app.post('/api/tables/:id/data', async (req: Request, res: Response) => {
  try {
    const data = await addTableRow(req.params.id as string, req.body)
    res.status(201).json(data)
  } catch {
    res.status(500).json({ error: 'Failed to add row' })
  }
})

// PUT /api/tables/:id/data
app.put('/api/tables/:id/data', async (req: Request, res: Response) => {
  try {
    const result = await updateTableRows(req.params.id as string, req.body.data)
    res.json(result)
  } catch {
    res.status(500).json({ error: 'Failed to update rows' })
  }
})

// DELETE /api/tables/:id/data/:rowId
app.delete('/api/tables/:id/data/:rowId', async (req: Request, res: Response) => {
  try {
    const result = await deleteTableRow(req.params.id as string, req.params.rowId as string)
    res.json(result)
  } catch {
    res.status(500).json({ error: 'Failed to delete row' })
  }
})

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})
