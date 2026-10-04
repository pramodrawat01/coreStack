import { computeStockStatus, bootstrapMissingStockRows } from '../utils/stockSync.js'

const DAY = 86400000
const round1 = (n) => Math.round(n * 10) / 10
const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100
const pctChange = (cur, prev) => (prev > 0 ? round1(((cur - prev) / prev) * 100) : null)
const marginPct = (profit, revenue) => (revenue > 0 ? round1((profit / revenue) * 100) : 0)

// UTC ranges, same convention as the invoice controller.
// prevFrom/prevTo = the equally long window right before, used for "vs last period".
function resolvePeriod(period = 'this_month') {
  const now = new Date()
  const y = now.getUTCFullYear()
  const m = now.getUTCMonth()
  const monthStart = (yy, mm) => new Date(Date.UTC(yy, mm, 1))
  let from, to

  switch (period) {
    case 'last_month':
      from = monthStart(y, m - 1); to = monthStart(y, m); break
    case 'this_quarter': {
      const q = Math.floor(m / 3) * 3
      from = monthStart(y, q); to = monthStart(y, q + 3); break
    }
    case 'last_90':
      to = new Date(Date.UTC(y, m, now.getUTCDate() + 1)); from = new Date(to - 90 * DAY); break
    case 'this_year':
      from = monthStart(y, 0); to = monthStart(y + 1, 0); break
    default:
      from = monthStart(y, m); to = monthStart(y, m + 1)
  }
  const span = to - from
  return { from, to, prevFrom: new Date(from - span), prevTo: from }
}

// ---------- helpers ----------

const keyOf = (date, unit) => new Date(date).toISOString().slice(0, unit === 'month' ? 7 : 10)
const pickUnit = (from, to, maxDays) => ((to - from) / DAY <= maxDays ? 'day' : 'month')

// Empty buckets are included so charts don't skip days/months; future buckets are cut off
function buildBuckets(from, to, unit) {
  const end = new Date(Math.min(to, Date.now()))
  const keys = []
  const d = new Date(from)
  if (unit === 'month') d.setUTCDate(1)
  while (d < end) {
    keys.push(keyOf(d, unit))
    if (unit === 'month') d.setUTCMonth(d.getUTCMonth() + 1)
    else d.setUTCDate(d.getUTCDate() + 1)
  }
  return keys
}

// One row per non-cancelled order: its net sales (subtotal, no tax/shipping) and cost of goods.
// Cost uses the product's CURRENT cost — orders don't snapshot cost, so profit is an estimate.
async function orderFacts(Order, from, to) {
  return Order.aggregate([
    { $match: { createdAt: { $gte: from, $lt: to }, fulfillmentStatus: { $ne: 'Cancelled' } } },
    { $unwind: '$items' },
    { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'p' } },
    {
      $addFields: {
        lineCost: {
          $multiply: ['$items.quantity', { $ifNull: [{ $arrayElemAt: ['$p.cost', 0] }, 0] }],
        },
      },
    },
    {
      $group: {
        _id: '$_id',
        customer: { $first: '$customer' },
        customerName: { $first: '$customerName' },
        createdAt: { $first: '$createdAt' },
        subtotal: { $first: '$subtotal' },
        cogs: { $sum: '$lineCost' },
      },
    },
  ])
}

const totals = (facts) => {
  const revenue = facts.reduce((s, f) => s + f.subtotal, 0)
  const cogs = facts.reduce((s, f) => s + f.cogs, 0)
  return { revenue, cogs, profit: revenue - cogs, orders: facts.length }
}

function buildSeries(facts, from, to, unit) {
  const map = new Map(
    buildBuckets(from, to, unit).map((k) => [k, { key: k, netSales: 0, grossProfit: 0 }])
  )
  for (const f of facts) {
    const row = map.get(keyOf(f.createdAt, unit))
    if (row) {
      row.netSales += f.subtotal
      row.grossProfit += f.subtotal - f.cogs
    }
  }
  return [...map.values()].map((r) => ({
    ...r, netSales: round2(r.netSales), grossProfit: round2(r.grossProfit),
  }))
}

function groupByCustomer(facts) {
  const map = new Map()
  for (const f of facts) {
    const key = String(f.customer)
    const row = map.get(key) || { customerId: key, customer: f.customerName, orders: 0, netSales: 0, grossProfit: 0 }
    row.orders += 1
    row.netSales += f.subtotal
    row.grossProfit += f.subtotal - f.cogs
    map.set(key, row)
  }
  return [...map.values()]
    .map((r) => ({
      ...r,
      netSales: round2(r.netSales),
      grossProfit: round2(r.grossProfit),
      marginPct: marginPct(r.grossProfit, r.netSales),
    }))
    .sort((a, b) => b.netSales - a.netSales)
}

// Both payment paths (invoice screen + Payments module) push into invoice.payments,
// so that's the one place that sees all cash. Refunds don't remove the embedded entry,
// so refunded Payment docs (matched on the same paidAt window) are subtracted.
async function cashCollected({ Invoice, Payment }, from, to) {
  const [gross, refunded] = await Promise.all([
    Invoice.aggregate([
      { $unwind: '$payments' },
      { $match: { 'payments.paidAt': { $gte: from, $lt: to } } },
      { $group: { _id: null, amount: { $sum: '$payments.amount' } } },
    ]),
    Payment.aggregate([
      { $match: { status: 'refunded', paidAt: { $gte: from, $lt: to } } },
      { $group: { _id: null, amount: { $sum: '$amount' } } },
    ]),
  ])
  return round2((gross[0]?.amount || 0) - (refunded[0]?.amount || 0))
}

const STATUS_ORDER = ['Delivered', 'Processing', 'Shipped', 'Cancelled']

// ---------- handlers ----------

// GET /api/reports/summary?period=
export const getReportsSummary = async (req, res) => {
  try {
    const { Order } = req.tenant.models
    const { from, to, prevFrom, prevTo } = resolvePeriod(req.query.period)

    const [facts, prevFacts, statusRows, prevOrderCount, cash, prevCash] = await Promise.all([
      orderFacts(Order, from, to),
      orderFacts(Order, prevFrom, prevTo),
      Order.aggregate([
        { $match: { createdAt: { $gte: from, $lt: to } } },
        { $group: { _id: '$fulfillmentStatus', count: { $sum: 1 } } },
      ]),
      Order.countDocuments({ createdAt: { $gte: prevFrom, $lt: prevTo } }),
      cashCollected(req.tenant.models, from, to),
      cashCollected(req.tenant.models, prevFrom, prevTo),
    ])

    const cur = totals(facts)
    const prev = totals(prevFacts)
    const orderStatus = STATUS_ORDER.map((status) => ({
      status,
      count: statusRows.find((r) => r._id === status)?.count || 0,
    }))
    const totalOrders = orderStatus.reduce((s, r) => s + r.count, 0)
    const unit = pickUnit(from, to, 95)

    res.json({
      period: { from, to },
      kpis: {
        revenue: { value: round2(cur.revenue), changePct: pctChange(cur.revenue, prev.revenue) },
        grossProfit: { value: round2(cur.profit), marginPct: marginPct(cur.profit, cur.revenue) },
        orders: { value: totalOrders, changePct: pctChange(totalOrders, prevOrderCount) },
        cashCollected: { value: cash, changePct: pctChange(cash, prevCash) },
      },
      unit,
      revenueSeries: buildSeries(facts, from, to, unit).map((r) => ({ key: r.key, revenue: r.netSales })),
      orderStatus,
      totalOrders,
      topCustomers: groupByCustomer(facts).slice(0, 5),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET /api/reports/sales?period=
export const getSalesReport = async (req, res) => {
  try {
    const { Order } = req.tenant.models
    const { from, to } = resolvePeriod(req.query.period)

    const facts = await orderFacts(Order, from, to)
    const cur = totals(facts)

    // Returning = customers who ordered in this period AND had a (non-cancelled) order before it
    const customerIds = [...new Set(facts.map((f) => String(f.customer)))]
    const earlier = customerIds.length
      ? await Order.distinct('customer', {
          createdAt: { $lt: from },
          fulfillmentStatus: { $ne: 'Cancelled' },
          customer: { $in: facts.map((f) => f.customer) },
        })
      : []

    const unit = pickUnit(from, to, 35)

    res.json({
      period: { from, to },
      kpis: {
        netSales: round2(cur.revenue),
        grossProfit: round2(cur.profit),
        avgOrderValue: cur.orders ? round2(cur.revenue / cur.orders) : 0,
        returningCustomersPct: customerIds.length ? round1((earlier.length / customerIds.length) * 100) : 0,
      },
      unit,
      series: buildSeries(facts, from, to, unit),
      byCustomer: groupByCustomer(facts).slice(0, 50),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET /api/reports/inventory?period=   (stock is a live snapshot; period only drives turnover)
export const getInventoryReport = async (req, res) => {
  try {
    const { Product, Warehouse, WarehouseStock, Order } = req.tenant.models
    await bootstrapMissingStockRows({ Product, WarehouseStock })
    const { from, to } = resolvePeriod(req.query.period)

    const [products, warehouses, stockRows, facts] = await Promise.all([
      Product.find({ isActive: true }).select('name sku cost reorderPoint').lean(),
      Warehouse.find().select('name code').lean(),
      WarehouseStock.find().select('product warehouse quantity').lean(),
      orderFacts(Order, from, to),
    ])

    const productMap = new Map(products.map((p) => [String(p._id), p]))
    const qtyByProduct = new Map()
    const valueByWh = new Map(warehouses.map((w) => [String(w._id), 0]))
    let unitsOnHand = 0
    let inventoryValue = 0

    for (const row of stockRows) {
      const p = productMap.get(String(row.product))
      if (!p) continue // inactive product
      const value = row.quantity * p.cost
      unitsOnHand += row.quantity
      inventoryValue += value
      qtyByProduct.set(String(p._id), (qtyByProduct.get(String(p._id)) || 0) + row.quantity)
      const wid = String(row.warehouse)
      if (valueByWh.has(wid)) valueByWh.set(wid, valueByWh.get(wid) + value)
    }

    const health = { healthy: 0, low: 0, out: 0 }
    const productRows = products.map((p) => {
      const onHand = qtyByProduct.get(String(p._id)) || 0
      const status = computeStockStatus(onHand, p.reorderPoint)
      if (status === 'In Stock') health.healthy++
      else if (status === 'Low Stock') health.low++
      else health.out++
      return { name: p.name, sku: p.sku, onHand, unitCost: p.cost, totalValue: round2(onHand * p.cost), status }
    })

    const cogs = totals(facts).cogs

    res.json({
      kpis: {
        inventoryValue: round2(inventoryValue),
        unitsOnHand,
        lowStockItems: health.low,
        turnover: inventoryValue > 0 ? round1(cogs / inventoryValue) : 0,
      },
      valueByWarehouse: warehouses
        .map((w) => ({ name: w.name, code: w.code, value: round2(valueByWh.get(String(w._id)) || 0) }))
        .sort((a, b) => b.value - a.value),
      health: { ...health, total: products.length },
      topProducts: productRows.sort((a, b) => b.totalValue - a.totalValue).slice(0, 5),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}