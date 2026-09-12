// stockQuantity - 
{/**

    // the first 3 are main terms

    onHand (total quantity in warehouse) - quantity in warehouse
    reserved/commited - promised for orders already
    available / free stock - onHand - reserved

    damaged - broken or expire units
    in Transit - moving stock between warehouses
    Incomming / On order - stock 
    reorder points - level that triggers a new purchase order
    backorder - customer wants but we have 0
    dead stock - stock that never sells
    safety stock - buffer to avoid stockout 
    */}

function computeStatus(product){
    if(!product.isActive) return 'Inactive'
    if(product.stockQuantity === 0) return 'Out of Stock'
    if(product. stockQuantity <= product.reorderPoint) return 'Low stock'
    return 'Active'
}


// to create a new product with status (inactive, or out of stock or low stock or active)
function withStatus(productDoc) {
  const obj = productDoc.toObject ? productDoc.toObject() : productDoc
  return { ...obj, status: computeStatus(obj) }
}


// GET /api/products?search=&category=&status=&page=&limit=
export async function listProducts(req, res){
    const { search='', category='', status='', page='', limit=''} = req.query
    const Product = req.tenant.models.Product

    const filter = {}
    if(search){
        // $or - "match either condition" - give me documents where at least one of these condition is true
        // $regex - not only exact match but the similar one 
        // $i - case - insensitive
        filter.$or = [
            { name : {$regex : search, $option : 'i'}},
            { sku : { $regex : search, $option : 'i'}},
        ]
    }

    if(category && category !== 'All') filter.category = category
    const skip = (Number(page) - 1) * Number(limit)

    // lean() = give the plain js object instead of mongo document
    let products = await Product.find(filter).sort({createdAt : -1}).lean()

    products = products.map((p) => ({...p, status : computeStatus(p)}))
    if(status && status !== 'All'){
        products = products.filter((p) => p.status === status)
    }

    const total = products.length
    const paginated = products.slice(skip, skip + Number(limit))

    res.status(200).json({products : paginated, total, page : Number(page), limit : Number(limit)})
}


// GET /api/products/categories — distinct category list for the tab bar
export async function listCategories(req, res) {
  const categories = await req.tenant.models.Product.distinct('category')
  res.json(categories)
}

// GET /api/products/:id
export async function getProduct(req, res) {
    const product = await req.tenant.models.Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
  res.json(withStatus(product))
}

// POST /api/products

export async function createProduct(req, res){

        // NOT authenticating the req.body here


    const {sku} = req.body
    const existing = await req.tenant.models.Product.findOne({sku : sku.toUpperCase()})
      if (existing) return res.status(400).json({ message: 'A product with this SKU already exists' })
    
        //// right now we are not taking imges - leter we will integrate this
    const product = await req.tenant.models.Product.create(req.body)
    res.status(201).json(withStatus(product))

}

/// while creating or updating product we have to keep many things in mind 
// which we are not doing yet like in which warehouse we are creating the product , who was the suppliear and transfer details ....many things


// PATCH /api/products/:id
export async function updateProduct(req, res){

    // NOT authenticating the req.body here

    const product = await req.tenant.models.Product.findById(req.params.id)
    if(!product) return res.status(404).json({ message: 'Product not found' })

    if(req.body.sku && req.body.sku.toUpperCase() !== product.sku){
        const existing = await req.tenant.models.Product.findOne({sku : req.body.sku.toUpperCase()})
        if(existing) return res.status(400).json({message : "A product with this SKU already exists"})
    }

    Object.assign(product, req.body)
    await product.save()
    res.json(withStatus(product))
}


// DELETE  /api/products/:id
export async function deleteProduct(req, res){
     const product = await req.tenant.models.Product.findById(req.params.id)
    if(!product) return res.status(404).json({ message: 'Product not found' })

    await product.deleteOne()
    res.json({message : 'Product deleted'})
}

