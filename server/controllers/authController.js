import crypto from 'crypto'
import GlobalUserIndex from '../models/master/GlobalUserIndex.js'
import Company from '../models/master/Company.js'
import { getTenantConnection } from '../config/connections.js'
import { getUserModel } from '../models/tenant/User.js'
import { getRoleModel } from '../models/tenant/Role.js'
import { setAuthCookie } from '../utils/generateToken.js'
import Invite from '../models/master/Invite.js'

const OWNER_PERMISSIONS = [
  'inventory:read', 'inventory:write',
  'orders:read', 'orders:write',
  'purchases:read', 'purchases:write',
  'invoices:read', 'invoices:write',
  'reports:read',
  'employees:read', 'employees:invite',
  'roles:manage',
]

// create slug of dbName
function slugify(str) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// POST /api/auth/signup                {name, email, password, companyName}
export async function signup(req, res){
    const {name, email, password, companyName} = req.body

    if(!name || !email || !password ||!companyName){
        return res.status(400).json({message : "provide the complete information !"})
    }

    // check does the email already exist of not in globalUserIndex 
    const existing = await GlobalUserIndex.findOne({email})
    if(existing) return res.status(400).json({ message: 'Email already in use' })
    
    const slug = slugify(companyName)
    const dbName = `company_${slug}_${crypto.randomBytes(4).toString('hex')}`

    /// 1- register company + routing index in master db
    const company = await Company.create({
        name : companyName,
        slug,
        dbName,
        ownerEmail : email
    })
    await GlobalUserIndex.create({
        email,
        companyId : company._id,
        dbName
    })

    /// 2 - Open and (create) tenant databse and seed the first user inside that
    const conn = getTenantConnection(dbName)
    const User = getUserModel(conn)
    const Role = getRoleModel(conn)

    const ownerRole = await Role.create({
        name : "Owner",
        permissions : OWNER_PERMISSIONS,
        isDefaultOwnerRole: true 
    })
    // hasing the password in userSchema 
    const user = await User.create({
        name, email, password, 
        role : ownerRole,
        status : "Active"
    })

    setAuthCookie(res, {userId : user._id, companyId : company._id , dbName})

    res.status(201).json({
        user : {id : user._id, name : user.name, email : user.email},
        company : {id : company._id, name : company.name},
        role : {id : ownerRole._id, name : ownerRole.name, permissions : ownerRole.permissions}
    })
}


// POST  /api/auth/login       {email, password}
export async function login( req, res){
    try {
        const {email, password} = req.body
        
        const indexEntry = await GlobalUserIndex.findOne({email})
        if (!indexEntry) return res.status(401).json({ message: 'Invalid email or password' })

        const conn = getTenantConnection(indexEntry.dbName)
        const User = getUserModel(conn) 
        getRoleModel(conn)

        const user = await User.findOne({email}).select('+password').populate('role')
        if (!user) return res.status(401).json({message : "Invalid email and password"})
        const match = await user.comparePassword(password)
        if(!match) return res.status(401).json({message : "Invalid email or password"})
        setAuthCookie(res, {userId : user._id, companyId : indexEntry.companyId, dbName : indexEntry.dbName })

        res.json({
            user: { id: user._id, name: user.name, email: user.email },
            role: { id: user.role._id, name: user.role.name, permissions: user.role.permissions },
        })


    } catch (err) {

    }
}

/// POST  /api/auth/logout
export function logout(req, res){
    res.clearCookie('token')
    res.json({message : 'Looged out'})
}


///  GET    api/auth/me       {protected route}
export function me(req, res){
    const {user, tenant} = req
    res.json({
        user: { id: user._id, name: user.name, email: user.email },
        company: { id: tenant.companyId },
        role: { id: user.role._id, name: user.role.name, permissions: user.role.permissions },
    })
}


// POST /api/auth/accept-invite  { token, name, password }
export async function acceptInvite(req, res){
    const {token , name, password} = req.body

    const invite = await Invite.findOne({token, status : 'pending'})
    if(!invite || invite.expiresAt < new Date()){
        return res.status(400).json(({
            message : "This invite is invalid or has expired"
        }))
    }

    const conn = getTenantConnection(invite.dbName)
    const User = getUserModel(conn)

    const existing = await User.findOne({email : invite.email})
    if(existing) return res.status(400).json({message  : "Email already in use"})
    
    const user = await User.create({
        name, 
        email : invite.email,
        password,
        role : invite.roleId,
        status : "Active"
    })

    await GlobalUserIndex.create({
        email : invite.email,
        companyId : invite.companyId,
        dbName : invite.dbName,
    })

    invite.status = 'accepted'
    await invite.save()

    setAuthCookie(res, {
        userId : user._id,
        companyId : invite.companyId,
        dbName : invite.dbName
    })
    res.status(201).json({
        user :  { id: user._id, name: user.name, email: user.email } 
    })
}
