import express from 'express'
import { protect, requirePermission } from '../middleware/auth.js'
import { createProduct, deleteProduct, getProduct, listCategories, listProducts, updateProduct } from '../controllers/productController.js'

const productRouter = express.Router()
productRouter.use(protect)

productRouter.get('/categories', requirePermission("products", 'read'), listCategories )
productRouter.get('/', requirePermission('products', 'read'), listProducts)
productRouter.get('/:id', requirePermission('products', 'read'), getProduct)

productRouter.post('/', requirePermission('products', 'write'), createProduct)
productRouter.patch('/:id', requirePermission('products', 'write'), updateProduct)

productRouter.delete('/:id', requirePermission('products', 'write'), deleteProduct)

export default productRouter