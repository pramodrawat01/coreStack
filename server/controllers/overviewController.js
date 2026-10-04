import { bootstrapMissingStockRows } from '../utils/stockSync.js'

const DAY = 86400000
const WINDOWS = { last_7: 7, last_30: 30, last_90: 90 }

const round1 = (n) => Math.round(n * 10) / 10
const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100
const pctChange = (cur, prev) => (prev > 0 ? round1(((cur - prev) / prev) * 100) : null)
const startOfTomorrow = () => {
  const n = new Date()
  return new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate() + 1))
}

// Rolling window ending at the end of today (UTC), plus the equally long window before it
function resolveWindow(period = 'last_30') {
  const days = WINDOWS[period] || 30
  const to = startOfTomorrow()
  const from = new Date(to - days * DAY)
  return { from, to, prevFrom: new Date(from - days * DAY), prevTo: from }
}

// Same revenue definition as Reports: order subtotal (no tax/shipping), cancelled excluded
async function orderTotals(Order, from, to) {
  const [r] = await Order.aggregate([
    { $match: { createdAt: { $gte: from, $lt: to }, fulfillmentStatus: { $ne: 'Cancelled' } } },
    { $group: { _id: null, revenue: { $sum: '$subtotal' }, orders: { $sum: 1 } } },
  ])
  return { revenue: r?.revenue || 0, orders: r?.orders || 0 }
}

// Last 12 months for the chart + the 12 months before them for the "vs previous period" delta
async function monthlyTrend(Order) {
  const now = new Date()
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 23, 1))
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1))

  const rows = await Order.aggregate([
    { $match: { createdAt: { $gte: start, $lt: end }, fulfillmentStatus: { $ne: 'Cancelled' } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        revenue: { $sum: '$subtotal' },
        orders: { $sum: 1 },
      },
    },
  ])
  const byKey = new Map(rows.map((r) => [r._id, r]))

  const all = Array.from({ length: 24 }, (_, i) => {
    const key = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + i, 1)).toISOString().slice(0, 7)
    const r = byKey.get(key)
    return { key, revenue: round2(r?.revenue || 0), orders: r?.orders || 0 }
  })
  const prev = all.slice(0, 12)
  const series = all.slice(12)
  const sum = (arr, f) => arr.reduce((s, x) => s + x[f], 0)

  return {
    series,
    totals: {
      revenue: round2(sum(series, 'revenue')),
      orders: sum(series, 'orders'),
      revenueChangePct: pctChange(sum(series, 'revenue'), sum(prev, 'revenue')),
      ordersChangePct: pctChange(sum(series, 'orders'), sum(prev, 'orders')),
    },
  }
}

// Six rolling 7-day buckets ending today. There is no returns flow yet, so the second
// series is cancelled orders.
async function weeklyOrders(Order) {
  const end = startOfTomorrow()
  const start = new Date(end - 42 * DAY)
  const rows = await Order.aggregate([
    { $match: { createdAt: { $gte: start, $lt: end } } },
    {
      $group: {
        _id: { $floor: { $divide: [{ $subtract: ['$createdAt', start] }, 7 * DAY] } },
        orders: { $sum: { $cond: [{ $ne: ['$fulfillmentStatus', 'Cancelled'] }, 1, 0] } },
        cancelled: { $sum: { $cond: [{ $eq: ['$fulfillmentStatus', 'Cancelled'] }, 1, 0] } },
      },
    },
  ])
  return Array.from({ length: 6 }, (_, i) => {
    const r = rows.find((x) => Number(x._id) === i)
    return { label: `Week ${i + 1}`, orders: r?.orders || 0, cancelled: r?.cancelled || 0 }
  })
}

// Live value (qty x current cost) and an estimate of the value at the start of the period:
// today's value minus the signed value of every stock movement since then.
async function inventoryValue({ Product, WarehouseStock, InventoryTransaction }, from) {
  await bootstrapMissingStockRows({ Product, WarehouseStock })

  const valuePipeline = [
    { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'p' } },
    { $unwind: '$p' },
    { $match: { 'p.isActive': true } },
  ]
  const [stock, moved] = await Promise.all([
    WarehouseStock.aggregate([
      ...valuePipeline,
      { $group: { _id: null, value: { $sum: { $multiply: ['$quantity', '$p.cost'] } } } },
    ]),
    InventoryTransaction.aggregate([
      { $match: { createdAt: { $gte: from } } },
      ...valuePipeline,
      { $group: { _id: null, value: { $sum: { $multiply: ['$quantity', '$p.cost'] } } } },
    ]),
  ])
  const now = stock[0]?.value || 0
  const then = now - (moved[0]?.value || 0)
  return { value: round2(now), changePct: pctChange(now, then) }
}

async function outstandingPayments(Invoice) {
  const today = new Date(new Date().toISOString().slice(0, 10))
  const [r] = await Invoice.aggregate([
    { $match: { status: { $in: ['sent', 'partially_paid'] } } },
    {
      $group: {
        _id: null,
        amount: { $sum: '$balance' },
        count: { $sum: 1 },
        overdue: { $sum: { $cond: [{ $lt: ['$dueDate', today] }, 1, 0] } },
      },
    },
  ])
  return { value: round2(r?.amount || 0), count: r?.count || 0, overdue: r?.overdue || 0 }
}

// GET /api/overview?period=last_7|last_30|last_90
// Open to every role; each section is only filled if the role can read that module.
export const getOverview = async (req, res) => {
  try {
    const m = req.tenant.models
    const { Order, Invoice, Product, Supplier, InventoryTransaction } = m
    const can = (module) => req.user.role?.permissions?.[module]?.read === true
    const canOrders = can('orders')
    const canInventory = can('inventory')
    const canInvoices = can('invoices')
    const { from, to, prevFrom, prevTo } = resolveWindow(req.query.period)

    const lowStockFilter = { isActive: true, $expr: { $lte: ['$stockQuantity', '$reorderPoint'] } }

    const activityFeeds = []
    if (canOrders) {
      activityFeeds.push(
        Order.find().sort({ createdAt: -1 }).limit(5).select('orderNumber customerName createdAt').lean()
          .then((rows) => rows.map((o) => ({
            type: 'order', at: o.createdAt, message: `New order ${o.orderNumber} placed by ${o.customerName}`,
          })))
      )
    }
    if (canInvoices) {
      activityFeeds.push(
        Invoice.find({ status: 'paid', paidAt: { $exists: true } }).sort({ paidAt: -1 }).limit(5)
          .select('invoiceNumber paidAt').lean()
          .then((rows) => rows.map((i) => ({
            type: 'invoice', at: i.paidAt, message: `Invoice ${i.invoiceNumber} marked as paid`,
          })))
      )
    }
    if (canInventory) {
      activityFeeds.push(
        InventoryTransaction.find({ type: 'ADJUSTMENT' }).sort({ createdAt: -1 }).limit(5)
          .populate('product', 'name').lean()
          .then((rows) => rows.map((t) => ({
            type: 'stock', at: t.createdAt,
            message: `Stock adjusted for ${t.product?.name || 'a product'} (${t.quantity > 0 ? '+' : ''}${t.quantity} units)`,
          })))
      )
    }
    if (can('suppliers')) {
      activityFeeds.push(
        Supplier.find().sort({ createdAt: -1 }).limit(5).select('companyName createdAt').lean()
          .then((rows) => rows.map((s) => ({
            type: 'supplier', at: s.createdAt, message: `New supplier ${s.companyName} added`,
          })))
      )
    }

    const [cur, prev, openOrders, trend, weekly, recentOrders, inventory, outstanding, lowTotal, lowItems, feeds] =
      await Promise.all([
        canOrders ? orderTotals(Order, from, to) : null,
        canOrders ? orderTotals(Order, prevFrom, prevTo) : null,
        canOrders ? Order.countDocuments({ fulfillmentStatus: { $in: ['Processing', 'Shipped'] } }) : null,
        canOrders ? monthlyTrend(Order) : null,
        canOrders ? weeklyOrders(Order) : null,
        canOrders
          ? Order.find().sort({ createdAt: -1 }).limit(5)
              .select('orderNumber customerName totalAmount fulfillmentStatus createdAt').lean()
          : null,
        canInventory ? inventoryValue(m, from) : null,
        canInvoices ? outstandingPayments(Invoice) : null,
        canInventory ? Product.countDocuments(lowStockFilter) : null,
        canInventory
          ? Product.find(lowStockFilter).sort({ stockQuantity: 1 }).limit(4)
              .select('name sku stockQuantity reorderPoint').lean()
          : null,
        Promise.all(activityFeeds),
      ])

    res.json({
      period: { from, to },
      kpis: {
        revenue: cur && { value: round2(cur.revenue), changePct: pctChange(cur.revenue, prev.revenue) },
        openOrders: cur && { value: openOrders, placed: cur.orders },
        inventoryValue: inventory,
        outstanding,
      },
      trend,
      weekly,
      recentOrders,
      lowStock: canInventory ? { total: lowTotal, items: lowItems } : null,
      activity: feeds.flat().sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 5),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}