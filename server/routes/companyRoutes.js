import express from 'express'
import { protect, requirePermission } from '../middleware/auth.js'
import { createRole, deleteRole, getPermissionSchema, inviteEmployee, listEmployees, listInvites, listRoles, revokeInvite, updateRole } from '../controllers/companyController.js'


const companyRouter = express.Router()
companyRouter.use(protect)

companyRouter.get('/permission-schema', getPermissionSchema)

companyRouter.post('/roles', requirePermission('roles' ,'manage'), createRole)
companyRouter.get('/roles', listRoles)
companyRouter.patch('/roles/:id', requirePermission('roles', 'manage'), updateRole)
companyRouter.delete('/roles/:id', requirePermission('roles' , 'manage'), deleteRole)

companyRouter.post('/invites', requirePermission('employees','invite'), inviteEmployee)
companyRouter.get('/invites', requirePermission('employees', 'read'), listInvites)
companyRouter.delete('/invites/:id', requirePermission('employees', 'invite'), revokeInvite)

companyRouter.get('/employees', requirePermission('employees', 'read'), listEmployees)


export default companyRouter    