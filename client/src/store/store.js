import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice.js'
import teamReducer from './teamSlice.js'
import productsReducer from './productsSlice.js'
import warehouseReducer from './warehousesSlice.js'
import inventoryReducer from './inventorySlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    team : teamReducer,
    products : productsReducer,
    warehouses : warehouseReducer,
    inventory : inventoryReducer,
  },
})  