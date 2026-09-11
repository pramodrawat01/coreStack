import { useAuth } from './useAuth.js'

export function usePermission(module, action) {
  const { role } = useAuth()
  return role?.permissions?.[module]?.[action] === true
}

// for checking multiple actions on one module at once, e.g. "can they see this module at all"
export function useModuleAccess(module) {
  const { role } = useAuth()
  const modulePerms = role?.permissions?.[module]
  if (!modulePerms) return false
  return Object.values(modulePerms).some((v) => v === true)
}