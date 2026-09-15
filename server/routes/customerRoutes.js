// server/routes/customerRoutes.js
import express from 'express'
import { protect, requirePermission } from '../middleware/auth.js'
import { getCustomers, getCustomerById, createCustomer, updateCustomer } from '../controllers/customerController.js'

const router = express.Router()
router.use(protect)

router.get('/', requirePermission('customers', 'read'), getCustomers)
router.get('/:id', requirePermission('customers', 'read'), getCustomerById)
router.post('/', requirePermission('customers', 'write'), createCustomer)
router.put('/:id', requirePermission('customers', 'write'), updateCustomer)

export default router