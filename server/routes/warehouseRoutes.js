import express from 'express'
import { protect, requirePermission } from '../middleware/auth.js'
import {
  listWarehouses, getWarehouseSummary, getWarehouse, createWarehouse, updateWarehouse, deleteWarehouse,
} from '../controllers/warehouseController.js'

const router = express.Router()
router.use(protect)

router.get('/summary', requirePermission('warehouse', 'read'), getWarehouseSummary)
router.get('/', requirePermission('warehouse', 'read'), listWarehouses)
router.get('/:id', requirePermission('warehouse', 'read'), getWarehouse)
router.post('/', requirePermission('warehouse', 'write'), createWarehouse)
router.patch('/:id', requirePermission('warehouse', 'write'), updateWarehouse)
router.delete('/:id', requirePermission('warehouse', 'write'), deleteWarehouse)

export default router