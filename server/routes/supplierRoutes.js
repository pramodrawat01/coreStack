import express from 'express'
import { protect, requirePermission } from '../middleware/auth.js'
import {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from '../controllers/supplierController.js'

const router = express.Router()
router.use(protect)

router.get('/', requirePermission('suppliers', 'read'), getSuppliers)
router.get('/:id', requirePermission('suppliers', 'read'), getSupplierById)
router.post('/', requirePermission('suppliers', 'write'), createSupplier)
router.put('/:id', requirePermission('suppliers', 'write'), updateSupplier)
router.delete('/:id', requirePermission('suppliers', 'write'), deleteSupplier)

export default router