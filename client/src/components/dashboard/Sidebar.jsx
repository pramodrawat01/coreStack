
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBoxOpen,
  FaTags,
  FaShoppingCart,
  FaUsers,
  FaTruck,
  FaWarehouse,
  FaFileInvoiceDollar,
  FaCreditCard,
  FaChartBar,
  FaCog,
  FaCubes,
  FaBuilding as FaWarehouseIcon
} from "react-icons/fa";
import { useModuleAccess } from '../../hooks/usePermission.js'

const NAV_ITEMS = [
  { icon: FaHome, label: 'Overview', to: '/dashboard', module: null }, // everyone with a login sees Overview
  { icon: FaBoxOpen, label: 'Inventory', to: '/dashboard/inventory', module: 'inventory' },
  { icon: FaWarehouseIcon, label: 'Warehouses', to: '/dashboard/warehouses', module: 'warehouses' },

  { icon: FaTags, label: 'Products', to: '/dashboard/products', module: 'products' },
  { icon: FaShoppingCart, label: 'Orders', to: '/dashboard/orders', module: 'orders' },
  { icon: FaUsers, label: 'Customers', to: '/dashboard/customers', module: 'customers' },
  { icon: FaTruck, label: 'Suppliers', to: '/dashboard/suppliers', module: 'suppliers' },
  { icon: FaWarehouse, label: 'Purchase Orders', to: '/dashboard/purchase-orders', module: 'purchases' },
  { icon: FaFileInvoiceDollar, label: 'Invoices', to: '/dashboard/invoices', module: 'invoices' },
  { icon: FaCreditCard, label: 'Payments', to: '/dashboard/payments', module: 'payments' },
  { icon: FaChartBar, label: 'Reports', to: '/dashboard/reports', module: 'reports' },
]

function NavItem({ item, collapsed, setCollapsed }) {
  // hooks can't be called conditionally, but this component always calls exactly one hook per render
  const hasAccess = useModuleAccess(item.module)
  if (item.module && !hasAccess) return null

  return (
   <NavLink
            key={item.label}
            to={item.to}
            end={item.to === "/dashboard"}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              ` flex items-center
                ${collapsed ? "justify-center" : "gap-3"}
                h-10 rounded-md px-3 py-2 text-[13px] transition-colors
                ${
                  isActive
                    ? "border-l-2 border-accent2 bg-white/[0.07] text-accent2"
                    : "border-l-2 border-transparent text-faint hover:text-white hover:bg-white/[0.04]"
                }
              `
            }
          >
            <item.icon size={14} />

            {!collapsed && (
              <span>{item.label}</span>
            )}
          </NavLink>
  )
}

export default function Sidebar({ collapsed, setCollapsed }) {
  return (
    <aside
      className={`
        hidden sm:flex
        h-full
        shrink-0
        flex-col
        border-r border-line
        bg-surface
        px-3 py-4
        transition-all duration-300
        ${collapsed ? "w-16" : "w-56"}
      `}
    >

      {/* LOGO */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`
          flex items-center
          ${collapsed ? "justify-center" : "gap-2"}
          px-2 pb-6
          text-left
        `}
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-white text-ink">
          <FaCubes size={12} />
        </span>

        {!collapsed && (
          <span className="text-sm font-semibold text-white">
            Corestack
          </span>
        )}
      </button>

      {/* NAVIGATION */}
      <nav className="flex flex-col gap-0.5">

        {NAV_ITEMS.map((item) => (
          
          <NavItem key={item.label} item={item} collapsed={collapsed} setCollapsed={setCollapsed} />
        ))}

      </nav>

      {/* SETTINGS */}
      <NavLink
        to="/dashboard/settings"
        title={collapsed ? "Settings" : undefined}
        className={({ isActive }) =>
          `
            mt-auto
            flex items-center
            ${collapsed ? "justify-center" : "gap-3"}
            rounded-md
            px-3 py-2
            text-[13px]
            transition-colors
            ${
              isActive
                ? "bg-white/[0.07] text-white"
                : "text-faint hover:text-white hover:bg-white/[0.04]"
            }
          `
        }
      >
        <FaCog size={13} />

        {!collapsed && (
          <span>Settings</span>
        )}
      </NavLink>

    </aside>
  );
}

