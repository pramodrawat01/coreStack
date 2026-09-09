import crypto from 'crypto'
import Invite from '../models/master/Invite.js'

// POST  - /api/company/roles       {name, permissions : []}
export async function createRole(req, res) {
    const {name, permissions} = req.body
    const role = await req.tenant.models.Role.create({
        name, 
        permissions
    })
    res.status(201).json(role)
}

// GET - /api/company/roles
export async function listRoles(req, res){
    const roles = await req.tenant.models.Role.find()
    res.json(roles)
}

// POST - /api/company/invites   {email roleId}
export async function inviteEmployee(req, res){
    const {email, roleId} = req.body

    const role = req.tenant.models.Role.findById(roleId)
    if(!role) return res.status(404).json({message : "Role not found"})

    const token = crypto.randomBytes(24).toString('hex')
    await Invite.create({
        companyId : req.tenant.companyId,
        dbName : req.tenant.dbName,
        email,
        roleId,
        invitedBy : req.user._id,
        expiresAt : new Date(Date.now() + 7 *24 * 60 * 60 * 1000),
    })
    res.status(201).json({
        inviteLink : `${process.env.CLIENT_URL}/accept-invite?token=${token}`
    })
}


// GET /api/company/employees
export async function listEmployees(req, res){
    const employees = await req.tenant.models.User.find().populate('role').select('-password')
    res.json(employees)
}