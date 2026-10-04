import express from 'express'
import { protect } from '../middleware/auth.js'
import { getOverview } from '../controllers/overviewController.js'

const router = express.Router()
router.use(protect) // no requirePermission: every role sees Overview, sections are filtered inside

router.get('/', getOverview)

export default router