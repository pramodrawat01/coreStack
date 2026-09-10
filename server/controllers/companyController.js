import crypto from 'crypto'
import Invite from '../models/master/Invite.js'
import { buildEmptyPermissions, PERMISSION_SCHEMA } from '../config/permissionSchema.js'

// GET - /api/company/permission-schema - frontend used this to render the checkbox grid dynamically
export function getPermissionSchema(req, res) {
  res.json({ schema: PERMISSION_SCHEMA, blank: buildEmptyPermissions() })   
}

// POST  - /api/company/roles       {name, permissions}
export async function createRole(req, res) {
    const {name, permissions} = req.body
    const role = await req.tenant.models.Role.create({
        name, 
        permissions : permissions || buildEmptyPermissions(),
    })
    res.status(201).json(role)
}

// GET - /api/company/roles
export async function listRoles(req, res){
    const roles = await req.tenant.models.Role.find()
    res.json(roles)
}

// PATCH - /api/company/roles/:id       {name?, permissions?}
export async function updateRole(req, res){
    const { id } = req.params
    const { name, permissions } = req.body

    const role = await req.tenant.models.Role.findById(id)
    if (!role) return res.status(404).json({ message: 'Role not found' })
    if(role.isDefaultOwnerRole) return res.status(400).json({ message: 'The Owner role cannot be edited' })

    if(name !== undefined) role.name = name
    if(permissions !== undefined)  role.permissions = permissions
    await role.save()
    
    res.json(role)

}

// DELETE /api/company/roles/:id
export async function deleteRole(req,res){
    const {id} = req.params

    const role = await req.tenant.models.Role.findById(id)
    if(!role) return res.status(404).json({message : "Role not found"})
    if (role.isDefaultOwnerRole) return res.status(400).json({ message: 'The Owner role cannot be deleted' })

    const inUse = await req.tenant.models.User.exists({role : id})
    if(inUse) return    res.status(400).json({ message: 'Cannot delete a role that is assigned to a member' })
    
    await role.deleteOne()
    res.json({message : "Role deleted"})

}

// POST - /api/company/invites   {email roleId}
export async function inviteEmployee(req, res){
    const {email, roleId} = req.body

    const role = await req.tenant.models.Role.findById(roleId)
    if(!role) return res.status(404).json({message : "Role not found"})

    const existingUser = await req.tenant.models.User.findOne({ email })
    if (existingUser) return res.status(400).json({ message: 'This person is already a member' })
    
    const existingInvite = await Invite.findOne({ email, dbName : req.tenant.dbName, status : 'pending'})
    if (existingInvite) return res.status(400).json({ message: 'An invite is already pending for this email' })


    const token = crypto.randomBytes(24).toString('hex')
    await Invite.create({
        companyId : req.tenant.companyId,
        dbName : req.tenant.dbName,
        email,
        roleId,
        token,
        invitedBy : req.user._id,
        expiresAt : new Date(Date.now() + 7 *24 * 60 * 60 * 1000),
    })
    res.status(201).json({
        inviteLink : `${process.env.CLIENT_URL}/accept-invite?token=${token}`
    })
}


//  GET /api/company/invites
export async function listInvites(req, res) {
    const invites = await Invite.find({dbName : req.tenant.dbName, status : 'pending'})
        .populate('roleId')
        .sort({createdAt : -1})
    res.json(invites)
}

// DELETE  /api/company/invites/:id
export async function revokeInvite(req, res) {
    const {id} = req.params
    const invite = await Invite.findOne({_id : id, dbName : req.tenant.dbName})
      if (!invite) return res.status(404).json({ message: 'Invite not found' })
    
    await invite.deleteOne()
    res.json({message : "Invite revoked"})

}

// GET /api/company/employees
export async function listEmployees(req, res){
    const employees = await req.tenant.models.User.find().populate('role').select('-password')
    res.json(employees)
}