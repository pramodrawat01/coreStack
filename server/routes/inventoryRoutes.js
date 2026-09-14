import express from 'express'
import { protect, requirePermission } from '../middleware/auth.js'
import {
  listInventory,
  getInventorySummary,
  getProductStock,
  adjustStock,
  transferStock,
} from '../controllers/inventoryController.js'

const inventoryRouter = express.Router()
inventoryRouter.use(protect)

inventoryRouter.get('/', requirePermission('inventory', 'read'), listInventory)
inventoryRouter.get('/summary', requirePermission('inventory', 'read'), getInventorySummary)
inventoryRouter.get('/stock/:productId', requirePermission('inventory', 'read'), getProductStock)

inventoryRouter.post('/adjust', requirePermission('inventory', 'write'), adjustStock)
inventoryRouter.post('/transfer', requirePermission('inventory', 'write'), transferStock)

export default inventoryRouter