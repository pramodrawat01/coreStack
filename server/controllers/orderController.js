
export const getOrders = async (req, res) => {
  try {
    const {Order} = await req.tenant.models
    const { search, status, timeRange } = req.query;

    const query = {};
    if (status && status !== 'All statuses') {
      query.fulfillmentStatus = status;
    }
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });

    // Aggregate Header Metrics
    const totalOrders = await Order.countDocuments();
    const processingCount = await Order.countDocuments({ fulfillmentStatus: 'Processing' });
    const shippedCount = await Order.countDocuments({ fulfillmentStatus: 'Shipped' });

    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      orders,
      stats: {
        totalOrders,
        processingCount,
        shippedCount,
        revenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const {Order} = await req.tenant.models
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const {Order} = await req.tenant.models
    
    // Auto-generate order number if missing
    if (!req.body.orderNumber) {
      const count = await Order.countDocuments();
      req.body.orderNumber = `#ORD-${20800 + count + 1}`;
    }

    // Default timeline setup
    req.body.timeline = [
      { status: 'placed', label: 'Order placed', completedAt: new Date() },
      { status: 'payment', label: 'Payment confirmed', completedAt: req.body.paymentStatus === 'Paid' ? new Date() : null },
      { status: 'picking', label: 'Picking in progress', completedAt: new Date() },
      { status: 'shipped', label: 'Shipped', completedAt: null }
    ];

    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const {Order} = await req.tenant.models
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};