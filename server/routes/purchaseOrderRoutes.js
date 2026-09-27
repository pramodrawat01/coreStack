import express from 'express'
import { protect, requirePermission } from '../middleware/auth.js'
import {
  getPurchaseOrders,
  getPurchaseOrderById,
  createPurchaseOrder,
  updatePurchaseOrder,
  receivePurchaseOrder,
} from '../controllers/purchaseOrderController.js'

const router = express.Router()
router.use(protect)

router.get('/', requirePermission('purchases', 'read'), getPurchaseOrders)
router.get('/:id', requirePermission('purchases', 'read'), getPurchaseOrderById)
router.post('/', requirePermission('purchases', 'write'), createPurchaseOrder)
router.put('/:id', requirePermission('purchases', 'write'), updatePurchaseOrder)
router.post('/:id/receive', requirePermission('purchases', 'write'), receivePurchaseOrder)

export default router