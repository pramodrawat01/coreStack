export const PERMISSION_SCHEMA = {
  inventory:  { label: 'Inventory',  actions: ['read', 'write'] },
  products:   { label: 'Products',   actions: ['read', 'write'] },
  warehouses: { label: 'Warehouses', actions: ['read', 'write'] },
  orders:     { label: 'Orders',     actions: ['read', 'write'] },
  purchases:  { label: 'Purchase Orders', actions: ['read', 'write'] },
  invoices:   { label: 'Invoices',   actions: ['read', 'write'] },
  payments:   { label: 'Payments',   actions: ['read', 'write'] },
  customers:  { label: 'Customers',  actions: ['read', 'write'] },
  suppliers:  { label: 'Suppliers',  actions: ['read', 'write'] },
  reports:    { label: 'Reports',    actions: ['read'] },
  employees:  { label: 'Team/Employee',       actions: ['read', 'invite'] },
  roles:      { label: 'Roles',      actions: ['manage'] },
}

// { inventory: { read: true, write: true }, ... } — everything true, used for the Owner role
export function buildFullPermissions() {
  const perms = {}
  for (const [module, { actions }] of Object.entries(PERMISSION_SCHEMA)) {
    perms[module] = {}
    for (const action of actions) perms[module][action] = true
  }
  return perms
}

// same shape, everything false — used as the starting point for a brand-new custom role
export function buildEmptyPermissions() {
  const perms = {}
  for (const [module, { actions }] of Object.entries(PERMISSION_SCHEMA)) {
    perms[module] = {}
    for (const action of actions) perms[module][action] = false
  }
  return perms
}