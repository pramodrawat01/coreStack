import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice.js'
import teamReducer from './teamSlice.js'
import productsReducer from './productsSlice.js'
import warehouseReducer from './warehousesSlice.js'
import inventoryReducer from './inventorySlice.js'
import customerReducer from './customersSlice.js'
import supplierReducer from './suppliersSlice.js'
import orderReducer from './ordersSlice.js'
import purchaseOrdersReducer from './purchaseOrdersSlice.js'
import invoiceReducer from './invoicesSlice.js'
import paymentReducer from './paymentsSlice.js'
import reportsReducer from './reportsSlice.js'
import overviewReducer from './overviewSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    team : teamReducer,
    products : productsReducer,
    warehouses : warehouseReducer,
    inventory : inventoryReducer,
    customers : customerReducer,
    suppliers : supplierReducer,
    orders : orderReducer,
    purchaseOrders : purchaseOrdersReducer,
    invoices : invoiceReducer,
    payments : paymentReducer,
    reports : reportsReducer,
    overview : overviewReducer,
  },
})  