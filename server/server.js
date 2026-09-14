import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import authRouter from './routes/authRoutes.js'
import companyRouter from './routes/companyRoutes.js'
import productRouter from './routes/productRoutes.js'
import warehouseRoutes from './routes/warehouseRoutes.js'
import inventoryRouter from './routes/inventoryRoutes.js'

dotenv.config()

// This is the MASTER connection — Company / GlobalUserIndex / Invite live here
await mongoose.connect(`${process.env.MONGO_CLUSTER_URI}/corestack_master?${process.env.MONGO_OPTIONS}`)
console.log("master db connected")


const app = express()

// middlewares
app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
        origin : process.env.CLIENT_URL,
        credentials : true     // credentials:true is required for cookies
    })
)

app.use('/api/auth', authRouter)
app.use('/api/company', companyRouter)
app.use('/api/products', productRouter)
app.use('/api/warehouses', warehouseRoutes)
app.use('/api/inventory', inventoryRouter)

// app.get("/",(req, res)=>{
//     res.send("server is listening at port 5000")
// })

// Global error handler — catches anything that slipped past a route's own try/catch
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ message: 'Something went wrong on our end' })
})

// Last-resort safety net — logs instead of crashing the whole process
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason)
})

app.listen(process.env.PORT, () => {
    
    console.log('server is listening')
})

