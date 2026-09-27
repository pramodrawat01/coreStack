// import express from 'express';
// import { getOrders, getOrderById, createOrder, updateOrder } from '../controllers/orderController.js';
// import { protect, requirePermission } from '../middleware/auth.js';

// const router = express.Router();

// router.use(protect);

// router.get('/', requirePermission('orders', 'read'), getOrders);
// router.get('/:id', requirePermission('orders', 'read'), getOrderById);
// router.post('/', requirePermission('orders', 'write'), createOrder);
// router.put('/:id', requirePermission('orders', 'write'), updateOrder);

// export default router;

import express from 'express';
import { getOrders, getOrderById, createOrder, updateOrder, shipOrder, deliverOrder } from '../controllers/orderController.js';
import { protect, requirePermission } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/', requirePermission('orders', 'read'), getOrders);
router.get('/:id', requirePermission('orders', 'read'), getOrderById);
router.post('/', requirePermission('orders', 'write'), createOrder);
router.put('/:id', requirePermission('orders', 'write'), updateOrder);
router.post('/:id/ship', requirePermission('orders', 'write'), shipOrder);
router.post('/:id/deliver', requirePermission('orders', 'write'), deliverOrder);

export default router;