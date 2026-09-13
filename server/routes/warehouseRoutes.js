import express from 'express'
import { protect, requirePermission } from '../middleware/auth.js'
import {
  listWarehouses, getWarehouseSummary, getWarehouse, createWarehouse, updateWarehouse, deleteWarehouse,
  getRecentActivity,
} from '../controllers/warehouseController.js'

const router = express.Router()
router.use(protect)

router.get('/summary', requirePermission('warehouses', 'read'), getWarehouseSummary)
router.get('/activity', requirePermission('warehouses', getRecentActivity))
router.get('/', requirePermission('warehouses', 'read'), listWarehouses)
router.get('/:id', requirePermission('warehouses', 'read'), getWarehouse)
router.post('/', requirePermission('warehouses', 'write'), createWarehouse)
router.patch('/:id', requirePermission('warehouses', 'write'), updateWarehouse)
router.delete('/:id', requirePermission('warehouses', 'write'), deleteWarehouse)

export default router