export const getSuppliers = async (req, res) => {
  try {
    const { Supplier } = req.tenant.models
    const { search, status } = req.query

    const query = {}
    if (status && status !== 'All') query.status = status
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { 'primaryContact.firstName': { $regex: search, $options: 'i' } },
        { 'primaryContact.lastName': { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { supplierId: { $regex: search, $options: 'i' } },
      ]
    }

    const suppliers = await Supplier.find(query).sort({ createdAt: -1 })

    const totalSuppliers = await Supplier.countDocuments()
    const activeSuppliers = await Supplier.countDocuments({ status: 'Active' })

    const agg = await Supplier.aggregate([
      { $group: { _id: null, openPOs: { $sum: '$openPurchaseOrders' }, avgLead: { $avg: '$averageLeadTime' } } },
    ])
    const aggregateData = agg[0] || { openPOs: 0, avgLead: 0 }

    res.json({
      suppliers,
      stats: {
        totalSuppliers,
        activeSuppliers,
        openPurchaseOrders: aggregateData.openPOs || 0,
        averageLeadTime: aggregateData.avgLead || 0,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getSupplierById = async (req, res) => {
  try {
    const { Supplier } = req.tenant.models
    const supplier = await Supplier.findById(req.params.id)
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' })
    res.json(supplier)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createSupplier = async (req, res) => {
  try {
    const { Supplier } = req.tenant.models
    if (!req.body.supplierId) {
      const count = await Supplier.countDocuments()
      req.body.supplierId = `SUP-${String(count + 1).padStart(5, '0')}`
    }
    const supplier = new Supplier(req.body)
    await supplier.save()
    res.status(201).json(supplier)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const updateSupplier = async (req, res) => {
  try {
    const { Supplier } = req.tenant.models
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' })
    res.json(supplier)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const deleteSupplier = async (req, res) => {
  try {
    const { Supplier } = req.tenant.models
    const supplier = await Supplier.findById(req.params.id)
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' })
    await supplier.deleteOne()
    res.json({ message: 'Supplier deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}