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

export default function App() {
  return(
    <Provider store={store}>
      <ToastContainer/>
      <AuthInitializer>
        <BrowserRouter>
            <Routes>
              {/** landing page */}
              <Route path='/' element={<LandingPage/>} />

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
                <Route path="inventory" element={<Inventory />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
                <Route path="customers" element={<Customers />} />
                <Route path="suppliers" element={<Suppliers />} />
                <Route path="purchase-orders" element={<PurchaseOrders />} />
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

