// This Middleware resolves the tenant connection per request

// ***************Every controller below the middleware(or after the middleware) now reads models off req.tenant.models instead of a fixed import.****************



import jwt from 'jsonwebtoken'
import { getTenantConnection } from '../config/connections.js'
import { getUserModel } from '../models/tenant/User.js'
import { getRoleModel } from '../models/tenant/Role.js'
import { getProductModel } from '../models/tenant/Product.js'
import { getWarehouseModel } from '../models/tenant/warehouse.js'
import { getInventoryTransactionModel } from '../models/tenant/InventoryTransaction.js'
import { getWarehouseStockModel } from '../models/tenant/WarehouseStock.js'
import { getCustomerModel } from '../models/tenant/Customer.js'
import { getSupplierModel } from '../models/tenant/Supplier.js'


export  async function protect(req, res, next){
    try {
        const token = req.cookies.token
        if(!token) return res.status(401).json({
            message : "Not authenticated!"
        })

        const decoded = jwt.verify(token, process.env.JWT_SECRET)  /// { userId, dbName, companyId}
        const conn = getTenantConnection(decoded.dbName)

        // creating Models here
        const User = getUserModel(conn)
        const Role = getRoleModel(conn)
        const Product = getProductModel(conn)
        const Warehouse = getWarehouseModel(conn)
        const InventoryTransaction = getInventoryTransactionModel(conn)
        const WarehouseStock = getWarehouseStockModel(conn)
        const Customer = getCustomerModel(conn)
        const Supplier = getSupplierModel(conn)

        const user = await User.findById(decoded.userId).populate("role")
        if(!user) return res.status(401).json({message : "Not authenticated!"})

            // need to explain this part ????
        req.user = user
        req.tenant = {
            companyId : decoded.companyId,
            dbName : decoded.dbName,
            connection : conn,
            models : {User, Role, Product, Warehouse, InventoryTransaction, WarehouseStock, Customer, Supplier}
        }
        next()
        
    } catch (error) {
        return res.status(401).json({
            message : "Invalid or Expired token"
        })
    }
}

export function requirePermission(module, action){
    return (req, res, next) => {
        const allowed = req.user.role?.permissions?.[module]?.[action] === true
        // console.log(req.user.role?.permissions)
        console.log(allowed)
        if(!allowed){
            return res.status(403).json({ message: 'You do not have permission to do this' }) 
        }
        
        next()

    }
}