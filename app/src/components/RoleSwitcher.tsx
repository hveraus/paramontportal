import { useRole } from '../context/RoleContext'
import type { UserRole } from '../types'

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'admin',           label: 'Admin' },
  { value: 'product_manager', label: 'Product Manager' },
  { value: 'pd_china',        label: 'PD Designer (China)' },
  { value: 'pd_us',           label: 'PD Designer (US)' },
  { value: 'sales',           label: 'Sales' },
]

export default function RoleSwitcher() {
  const { role, setRole } = useRole()

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-amber-700 font-medium text-xs uppercase tracking-wide">
        Role Preview
      </span>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value as UserRole)}
        className="border border-amber-300 rounded-md px-3 py-1.5 text-sm bg-white text-slate-700
                   focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
      >
        {ROLES.map((r) => (
          <option key={r.value} value={r.value}>{r.label}</option>
        ))}
      </select>
      <span className="text-amber-600 text-xs hidden sm:block">
        Switching role changes tab visibility and action buttons
      </span>
    </div>
  )
}
