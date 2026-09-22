import express from 'express';
import { getOrders, getOrderById, createOrder, updateOrder } from '../controllers/orderController.js';
import { protect, requirePermission } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', requirePermission('orders', 'read'), getOrders);
router.get('/:id', requirePermission('orders', 'read'), getOrderById);
router.post('/', requirePermission('orders', 'write'), createOrder);
router.put('/:id', requirePermission('orders', 'write'), updateOrder);

export default router;