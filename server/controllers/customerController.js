// server/controllers/customerController.js
export const getCustomers = async (req, res) => {
  try {
    const { Customer } = req.tenant.models
    const { search, status } = req.query

    const query = {}
    if (status && status !== 'All') query.status = status
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { 'primaryContact.firstName': { $regex: search, $options: 'i' } },
        { 'primaryContact.lastName': { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { accountId: { $regex: search, $options: 'i' } },
      ]
    }

    const customers = await Customer.find(query).sort({ createdAt: -1 })

    const totalCustomers = await Customer.countDocuments()
    const activeCustomers = await Customer.countDocuments({ status: 'Active' })

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)
    const newThisMonth = await Customer.countDocuments({ createdAt: { $gte: startOfMonth } })

    const totalSpentAggregation = await Customer.aggregate([
      { $group: { _id: null, totalSpent: { $sum: '$totalSpent' }, totalOrders: { $sum: '$totalOrders' } } },
    ])
    const aggregateData = totalSpentAggregation[0] || { totalSpent: 0, totalOrders: 0 }
    const avgOrderValue = aggregateData.totalOrders > 0 ? aggregateData.totalSpent / aggregateData.totalOrders : 0

    res.json({ customers, stats: { totalCustomers, activeCustomers, newThisMonth, avgOrderValue } })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getCustomerById = async (req, res) => {
  try {
    const { Customer } = req.tenant.models
    const customer = await Customer.findById(req.params.id)
    if (!customer) return res.status(404).json({ message: 'Customer not found' })
    res.json(customer)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createCustomer = async (req, res) => {
  try {
    const { Customer } = req.tenant.models
    if (!req.body.accountId) {
      const count = await Customer.countDocuments()
      req.body.accountId = `NSR-${String(count + 1).padStart(5, '0')}`
    }
    const customer = new Customer(req.body)
    await customer.save()
    res.status(201).json(customer)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const updateCustomer = async (req, res) => {
  try {
    const { Customer } = req.tenant.models
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!customer) return res.status(404).json({ message: 'Customer not found' })
    res.json(customer)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}