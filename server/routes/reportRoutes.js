import express from 'express'
import { protect, requirePermission } from '../middleware/auth.js'
import { getReportsSummary, getSalesReport, getInventoryReport } from '../controllers/reportController.js'

const router = express.Router()
router.use(protect)

const read = requirePermission('reports', 'read')

router.get('/summary', read, getReportsSummary)
router.get('/sales', read, getSalesReport)
router.get('/inventory', read, getInventoryReport)

export default router