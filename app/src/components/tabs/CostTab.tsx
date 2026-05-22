import type { ProductDetail } from '../../types'

const EDIT_INPUT_CLS = "w-full h-9 px-3 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-colors font-mono"

function usd(v: number | null, decimals = 2) {
  if (v === null || v === undefined) return <span className="text-slate-300">—</span>
  return <span className="font-mono tabular-nums">${v.toFixed(decimals)}</span>
}

function cny(v: number | null) {
  if (v === null || v === undefined) return <span className="text-slate-300">—</span>
  return <span className="font-mono tabular-nums">¥{v.toLocaleString('en-US')}</span>
}

function NumInput({ value, onChange }: { value: number | null; onChange: (v: number | null) => void }) {
  return (
    <input
      type="number"
      step="0.01"
      className={EDIT_INPUT_CLS}
      value={value ?? ''}
      onChange={e => onChange(e.target.value === '' ? null : Number(e.target.value))}
    />
  )
}

interface Props {
  product: ProductDetail
  isEditing: boolean
  onChange: (fields: Partial<ProductDetail>) => void
}

export default function CostTab({ product, isEditing, onChange }: Props) {
  return (
    <div className="max-w-sm">
      <div className="space-y-5">

        {/* Retail */}
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Retail</p>
          <div className="text-sm text-slate-800">
            {isEditing
              ? <NumInput value={product.retail} onChange={v => onChange({ retail: v })} />
              : usd(product.retail, 2)
            }
          </div>
        </div>

        {/* RMB Purchase */}
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">RMB Purchase (Reference Price)</p>
          <div className="text-sm text-slate-800">
            {isEditing
              ? <NumInput value={product.rmbPurchase} onChange={v => onChange({ rmbPurchase: v })} />
              : cny(product.rmbPurchase)
            }
          </div>
        </div>

        {/* Dollar Purchase */}
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Dollar Purchase (Reference Price)</p>
          <div className="text-sm text-slate-800">
            {isEditing
              ? <NumInput value={product.dollarPurchase} onChange={v => onChange({ dollarPurchase: v })} />
              : usd(product.dollarPurchase, 3)
            }
          </div>
        </div>

      </div>
    </div>
  )
}
