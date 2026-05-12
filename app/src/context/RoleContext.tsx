import { createContext, useContext, useState, type ReactNode } from 'react'
import type { UserRole } from '../types'

export interface CurrentUser {
  id: string
  name: string
  avatar: string
  team: 'US' | 'NB'
}

interface RoleContextValue {
  role: UserRole
  setRole: (r: UserRole) => void
  can: (action: Permission) => boolean
  currentUser: CurrentUser
}

export type Permission =
  | 'view_cost'
  | 'view_patents'
  | 'view_favorite'
  | 'view_share'
  | 'view_print'
  | 'view_export'

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin:           ['view_cost', 'view_patents', 'view_favorite', 'view_share', 'view_print', 'view_export'],
  product_manager: ['view_cost', 'view_patents', 'view_favorite', 'view_share', 'view_print', 'view_export'],
  pd_china:        ['view_favorite', 'view_share', 'view_print'],
  pd_us:           ['view_favorite', 'view_share', 'view_print'],
  sales:           ['view_favorite', 'view_print'],
}

const ROLE_USERS: Record<UserRole, CurrentUser> = {
  admin:           { id: 'u-sarah',  name: 'Sarah Thompson', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ST&backgroundColor=f59e0b&fontColor=ffffff', team: 'US' },
  product_manager: { id: 'u-sarah',  name: 'Sarah Thompson', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ST&backgroundColor=f59e0b&fontColor=ffffff', team: 'US' },
  pd_china:        { id: 'u-xiaomei', name: 'Xiaomei Li',    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=XL&backgroundColor=3b82f6&fontColor=ffffff', team: 'NB' },
  pd_us:           { id: 'u-sarah',  name: 'Sarah Thompson', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ST&backgroundColor=f59e0b&fontColor=ffffff', team: 'US' },
  sales:           { id: 'u-wei',    name: 'Wei Zhang',      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=WZ&backgroundColor=10b981&fontColor=ffffff',  team: 'NB' },
}

const RoleContext = createContext<RoleContextValue | null>(null)

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('admin')

  const can = (action: Permission) => ROLE_PERMISSIONS[role].includes(action)
  const currentUser = ROLE_USERS[role]

  return (
    <RoleContext.Provider value={{ role, setRole, can, currentUser }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const ctx = useContext(RoleContext)
  if (!ctx) throw new Error('useRole must be used inside RoleProvider')
  return ctx
}
