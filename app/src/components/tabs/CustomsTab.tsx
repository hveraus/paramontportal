import type { ProductDetail } from '../../types'

const INPUT_CLS = "w-full h-9 px-3 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-colors"

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">{label}</p>
      <div className="text-sm text-slate-800">{children}</div>
    </div>
  )
}

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="col-span-2 flex items-center gap-3 pb-1">
      <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">{title}</span>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  )
}

function pct(v: number | null) {
  if (v === null || v === undefined) return <span className="text-slate-300">—</span>
  return <span className="font-medium">{v.toFixed(1)}%</span>
}

function usd(v: number | null) {
  if (v === null || v === undefined) return <span className="text-slate-300">—</span>
  return <span className="font-mono font-medium">${v.toFixed(3)}</span>
}

function str(v: string | null | undefined) {
  if (!v) return <span className="text-slate-300">—</span>
  return <span>{v}</span>
}

interface Props {
  product: ProductDetail
  isEditing: boolean
  onChange: (fields: Partial<ProductDetail>) => void
}

export default function CustomsTab({ product, isEditing, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-5">

      <SectionDivider title="Classification" />

      <Field label="HTS Category">
        {isEditing
          ? <input type="text" className={INPUT_CLS} value={product.htsCategory} onChange={e => onChange({ htsCategory: e.target.value })} />
          : str(product.htsCategory)
        }
      </Field>

      <Field label="HTS Code">
        {isEditing
          ? <input type="text" className={INPUT_CLS + ' font-mono'} value={product.htsCode} onChange={e => onChange({ htsCode: e.target.value })} />
          : <span className="font-mono text-blue-700">{product.htsCode || '—'}</span>
        }
      </Field>

      <Field label="Country of Origin">
        {isEditing
          ? <input type="text" className={INPUT_CLS} value={product.countryOfOrigin} onChange={e => onChange({ countryOfOrigin: e.target.value })} />
          : str(product.countryOfOrigin)
        }
      </Field>

      <Field label="Tariff">
        {isEditing
          ? <input type="text" className={INPUT_CLS} value={product.tariff ?? ''} onChange={e => onChange({ tariff: e.target.value || null })} />
          : str(product.tariff)
        }
      </Field>

      <SectionDivider title="Duties & Tariffs" />

      <Field label="Duty %">
        {isEditing
          ? <input type="number" step="0.01" className={INPUT_CLS} value={product.dutyPercent ?? ''} onChange={e => onChange({ dutyPercent: e.target.value === '' ? null : Number(e.target.value) })} />
          : pct(product.dutyPercent)
        }
      </Field>

      <Field label="Duty $">
        {isEditing
          ? <input type="number" step="0.001" className={INPUT_CLS} value={product.dutyDollar ?? ''} onChange={e => onChange({ dutyDollar: e.target.value === '' ? null : Number(e.target.value) })} />
          : usd(product.dutyDollar)
        }
      </Field>

      <Field label="15% Extra Tariff">
        {isEditing
          ? <input type="number" step="0.01" className={INPUT_CLS} value={product.extraTariff15 ?? ''} onChange={e => onChange({ extraTariff15: e.target.value === '' ? null : Number(e.target.value) })} />
          : pct(product.extraTariff15)
        }
      </Field>

      <Field label="Total Duty Rate">
        {isEditing
          ? <input type="number" step="0.01" className={INPUT_CLS} value={product.totalDutyRate ?? ''} onChange={e => onChange({ totalDutyRate: e.target.value === '' ? null : Number(e.target.value) })} />
          : <span className={`font-semibold ${product.totalDutyRate !== null && product.totalDutyRate > 20 ? 'text-orange-600' : 'text-slate-800'}`}>
              {product.totalDutyRate !== null ? `${product.totalDutyRate.toFixed(1)}%` : '—'}
            </span>
        }
      </Field>

      <Field label="DA (Defective Allowance)">
        {isEditing
          ? <input type="number" step="0.01" className={INPUT_CLS} value={product.defectiveAllowance ?? ''} onChange={e => onChange({ defectiveAllowance: e.target.value === '' ? null : Number(e.target.value) })} />
          : pct(product.defectiveAllowance)
        }
      </Field>

    </div>
  )
}
