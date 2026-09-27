import { Provider } from 'react-redux'
import AuthPage from './pages/AuthPage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { store } from './store/store.js'
import PublicRoute from './components/PublicRoute.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

import AuthInitializer from './components/AuthInitializer.jsx'
import Inventory from './pages/dashboard/Inventory.jsx'
import Products from './pages/dashboard/Products.jsx'
import Orders from './pages/dashboard/Orders.jsx'
import Customers from './pages/dashboard/Customers.jsx'
import Suppliers from './pages/dashboard/Suppliers.jsx'
import PurchaseOrders from './pages/dashboard/PurchaseOrders.jsx'
import Invoices from './pages/dashboard/Invoices.jsx'
import Payments from './pages/dashboard/Payments.jsx'
import Reports from './pages/dashboard/Reports.jsx'

import SettingsLayout from './pages/dashboard/settings/SettingsLayout.jsx'
import CompanySettings from './pages/dashboard/settings/CompanySettings.jsx'
import TeamMembers from './pages/dashboard/settings/TeamMembers.jsx'
import RolesPermissions from './pages/dashboard/settings/RolesPermissions.jsx'
import Invitations from './pages/dashboard/settings/Invitations.jsx'
import ProfileSettings from './pages/dashboard/settings/ProfileSettings.jsx'
import SecuritySettings from './pages/dashboard/settings/SecuritySettings.jsx'
import NotificationSettings from './pages/dashboard/settings/NotificationSettings.jsx'
import Overview from './pages/dashboard/Overview.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import AcceptInvitePage from './pages/AcceptInvitePage.jsx'

import PermissionRoute from './components/PermissionRoute.jsx'
import InviteTeamMember from './pages/dashboard/settings/InviteTeamMember.jsx'
import ProductForm from './pages/dashboard/ProductForm.jsx'
import ProductDetail from './pages/dashboard/ProductDetail.jsx'
import Warehouses from './pages/dashboard/Warehouses.jsx'
import WarehouseForm from './pages/dashboard/WarehouseForm.jsx'
import WarehouseDetail from './pages/dashboard/WarehouseDetail.jsx'
import StockAdjustment from './pages/dashboard/StockAdjustment.jsx'
import TransferStock from './pages/dashboard/TransferStock.jsx'
import CustomerForm from './pages/dashboard/CustomerForm.jsx'
import CustomerDetail from './pages/dashboard/CustomerDetail.jsx'
import SupplierForm from './pages/dashboard/SupplierForm.jsx'
import SupplierDetail from './pages/dashboard/SupplierDetail.jsx'
import OrderDetail from './pages/dashboard/OrderDetail.jsx'
import OrderForm from './pages/dashboard/OrderForm.jsx'
import SolutionsPage from './pages/Solutions.jsx'
import RootLayout from './layouts/RootLayout.jsx'
import FeaturesPage from './pages/FeaturesPage.jsx'
import PricingPage from './pages/PricingPage.jsx'
import ResourcesPage from './pages/ResourcesPage.jsx'
import PurchaseOrderForm from './pages/dashboard/PurchaseOrderForm.jsx'
import PurchaseOrderDetail from './pages/dashboard/PurchaseOrderDetail.jsx'

export default function App() {
  return(
    <Provider store={store}>
      <ToastContainer/>
      <AuthInitializer>
        <BrowserRouter>
            <Routes>
              {/** landing page */}
              <Route path='/' element={<RootLayout/>} >
                <Route index element={<LandingPage/>} />
                <Route path='/solutions' element={<SolutionsPage/>} />
                <Route path='/features' element={<FeaturesPage/>} />
                <Route path='/pricing' element={<PricingPage/>}/>
                <Route path='resources' element={<ResourcesPage/>} />
              </Route>

              <Route path='/auth' element={
                <PublicRoute>
                  <AuthPage/>
                </PublicRoute>
              } />

              <Route path='/accept-invite' element={<PublicRoute><AcceptInvitePage/></PublicRoute>} />

              <Route path='/dashboard' element={
                <ProtectedRoute>
                  <DashboardLayout/>
                </ProtectedRoute>
              }>
                <Route index element={<Overview />} />
                <Route path="inventory" element={<PermissionRoute module="inventory" action="read"><Inventory /></PermissionRoute>} />
                <Route path="inventory/adjust" element={<PermissionRoute module="inventory" action="write"><StockAdjustment /></PermissionRoute>} />
                <Route path="inventory/transfer" element={<PermissionRoute module="inventory" action="write"><TransferStock /></PermissionRoute>} />

                <Route path="products" element={<PermissionRoute module="products" action="read"><Products /></PermissionRoute>} />
                <Route path="products/new" element={<PermissionRoute module="products" action="write"><ProductForm /></PermissionRoute>} />
                <Route path="products/:id" element={<PermissionRoute module="products" action="read"><ProductDetail /></PermissionRoute>} />
                <Route path="products/:id/edit" element={<PermissionRoute module="products" action="write"><ProductForm /></PermissionRoute>} />

                <Route path="warehouses" element={<PermissionRoute module="warehouses" action="read"><Warehouses /></PermissionRoute>} />
                <Route path="warehouses/new" element={<PermissionRoute module="warehouses" action="write"><WarehouseForm /></PermissionRoute>} />
                <Route path="warehouses/:id" element={<PermissionRoute module="warehouses" action="read"><WarehouseDetail /></PermissionRoute>} />
                <Route path="warehouses/:id/edit" element={<PermissionRoute module="warehouses" action="write"><WarehouseForm /></PermissionRoute>} />

                <Route path="orders" element={<PermissionRoute module="orders" action="read"> <Orders/></PermissionRoute>} />
                <Route path="orders/:id" element={<PermissionRoute module="orders" action="read"> <OrderDetail/> </PermissionRoute>} />
                <Route path="orders/new" element={<PermissionRoute module="orders" action="write"> <OrderForm/></PermissionRoute>} />
                <Route path="orders/:id/edit" element={<PermissionRoute module="orders" action="write"> <OrderDetail/> </PermissionRoute>} />


                <Route path="customers" element={<PermissionRoute module="customers" action="read"><Customers/></PermissionRoute>} />
                <Route path="customers/new" element={<PermissionRoute module="customers" action="write"><CustomerForm/></PermissionRoute>} />
                <Route path="customers/:id" element={<PermissionRoute module="customers" action="read"><CustomerDetail/></PermissionRoute>} />
                <Route path="customers/:id/edit" element={<PermissionRoute module="customers" action="write"><CustomerForm/></PermissionRoute>} />

                <Route path="suppliers" element={<Suppliers />} />
                <Route path="suppliers" element={<PermissionRoute module="suppliers" action="read"><Suppliers /></PermissionRoute>} />
                <Route path="suppliers/new" element={<PermissionRoute module="suppliers" action="write"><SupplierForm /></PermissionRoute>} />
                <Route path="suppliers/:id" element={<PermissionRoute module="suppliers" action="read"><SupplierDetail /></PermissionRoute>} />
                <Route path="suppliers/:id/edit" element={<PermissionRoute module="suppliers" action="write"><SupplierForm /></PermissionRoute>} />

                <Route path="purchase-orders" element={<PermissionRoute module ="purchases" action="read"> <PurchaseOrders/> </PermissionRoute>} />
                <Route path="purchase-orders/new" element={<PermissionRoute module ="purchases" action="write"> <PurchaseOrderForm/> </PermissionRoute>} />
                <Route path="purchase-orders/:id" element={<PermissionRoute module ="purchases" action="read"> <PurchaseOrderDetail/> </PermissionRoute>} />

                <Route path="invoices" element={<Invoices />} />
                <Route path="payments" element={<Payments />} />
                <Route path="reports" element={<Reports />} />

                <Route path="settings" element={<SettingsLayout/>} >
                  <Route index element={<Navigate to="company" replace />} /> 
                  <Route path="company" element={<CompanySettings />} />
                  <Route path="users" element={<PermissionRoute module="employees" action="read"><TeamMembers /></PermissionRoute>} />
                  <Route path="roles" element={<PermissionRoute module="employees" action="read"> <RolesPermissions />  </PermissionRoute> } />
                  <Route path='invite' element={<PermissionRoute module="employees" action="invite" ><InviteTeamMember/></PermissionRoute>} />
                  <Route path="invitations" element={<PermissionRoute module="employees" action="invite"><Invitations /></PermissionRoute>} />
                  <Route path="profile" element={<ProfileSettings />} />
                  <Route path="security" element={<SecuritySettings />} />
                  <Route path="notifications" element={<NotificationSettings />} />
                </Route>
              </Route>
            </Routes>
        </BrowserRouter>
      </AuthInitializer>
    </Provider>
  )
}

