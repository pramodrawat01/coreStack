import express from 'express'
import { requirePermission } from '../middleware/auth.js'
import { createRole, inviteEmployee, listEmployees, listRoles } from '../controllers/companyController.js'


const companyRouter = express.Router()

companyRouter.post('/roles', requirePermission('roles : manage'), createRole)
companyRouter.get('/roles', listRoles)
companyRouter.post('/invites', requirePermission('employees : invite'), inviteEmployee)
companyRouter.get('/employees', requirePermission('employees : read'), listEmployees)

export default companyRouter