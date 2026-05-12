import type { ReactNode } from 'react'

interface Props {
  label: string
  children: ReactNode
  full?: boolean
}

export default function FieldRow({ label, children, full }: Props) {
  return (
    <div className={full ? 'col-span-2' : ''}>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">{label}</p>
      <div className="text-sm text-slate-800">{children}</div>
    </div>
  )
}
