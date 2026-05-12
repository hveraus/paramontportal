type Variant = 'green' | 'orange' | 'red' | 'blue' | 'gray' | 'purple' | 'yellow'

const VARIANTS: Record<Variant, string> = {
  green:  'bg-emerald-100 text-emerald-700 border-emerald-200',
  orange: 'bg-orange-100 text-orange-700 border-orange-200',
  red:    'bg-red-100 text-red-700 border-red-200',
  blue:   'bg-blue-100 text-blue-700 border-blue-200',
  gray:   'bg-slate-100 text-slate-600 border-slate-200',
  purple: 'bg-violet-100 text-violet-700 border-violet-200',
  yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
}

export default function StatusTag({
  label,
  variant,
  dot = true,
}: {
  label: string
  variant: Variant
  dot?: boolean
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1
                  rounded-full border ${VARIANTS[variant]}`}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {label}
    </span>
  )
}
