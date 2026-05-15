import type { ProductDetail } from '../../types'

const EDIT_INPUT_CLS = "w-full h-8 px-2 text-sm text-right rounded border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"

function usd(v: number | null, decimals = 3) {
  if (v === null || v === undefined) return <span className="text-slate-300">—</span>
  return <span className="font-mono tabular-nums">${v.toFixed(decimals)}</span>
}

function cny(v: number | null) {
  if (v === null || v === undefined) return <span className="text-slate-300">—</span>
  return <span className="font-mono tabular-nums">¥{v.toLocaleString('en-US')}</span>
}

function pct(v: number | null) {
  if (v === null || v === undefined) return <span className="text-slate-300">—</span>
  return <span className="font-mono tabular-nums">{v.toFixed(1)}%</span>
}

function SectionDivider({ title, first }: { title: string; first?: boolean }) {
  return (
    <tr>
      <td colSpan={2} className={`${first ? '' : 'pt-5'} pb-1`}>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-700 whitespace-nowrap uppercase tracking-wide">{title}</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>
      </td>
    </tr>
  )
}

function Row({
  label, children, highlight,
}: {
  label: string
  children: React.ReactNode
  highlight?: boolean
}) {
  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className={`py-2.5 text-sm ${highlight ? 'font-semibold text-slate-900' : 'text-slate-500'}`}>
        {label}
      </td>
      <td className={`py-2.5 text-right text-sm ${highlight ? 'text-blue-700 font-semibold' : 'text-slate-800'}`}>
        {children}
      </td>
    </tr>
  )
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
  const gp = product.nbGpPercent

  return (
    <div className="space-y-5">
      <table className="w-full">
        <tbody>
          <SectionDivider title="Pricing" first />
          <Row label="Retail">
            {isEditing
              ? <NumInput value={product.retail} onChange={v => onChange({ retail: v })} />
              : usd(product.retail, 2)
            }
          </Row>
          <Row label="RMB Purchase">
            {isEditing
              ? <NumInput value={product.rmbPurchase} onChange={v => onChange({ rmbPurchase: v })} />
              : cny(product.rmbPurchase)
            }
          </Row>
          <Row label="Dollar Purchase">
            {isEditing
              ? <NumInput value={product.dollarPurchase} onChange={v => onChange({ dollarPurchase: v })} />
              : usd(product.dollarPurchase)
            }
          </Row>
          <Row label="Est. Plating / Molding Cost (CNY)">
            {isEditing
              ? <NumInput value={product.estPlatingMoldingCost} onChange={v => onChange({ estPlatingMoldingCost: v })} />
              : cny(product.estPlatingMoldingCost)
            }
          </Row>

          <SectionDivider title="COGS" />
          <Row label="NB Suggested COGS">
            {isEditing
              ? <NumInput value={product.nbSuggestedCogs} onChange={v => onChange({ nbSuggestedCogs: v })} />
              : usd(product.nbSuggestedCogs)
            }
          </Row>
          <Row label="Finalized COGS (NB)">
            {isEditing
              ? <NumInput value={product.finalizedCogsNb} onChange={v => onChange({ finalizedCogsNb: v })} />
              : usd(product.finalizedCogsNb)
            }
          </Row>
          <Row label="Total COGS" highlight>
            {isEditing
              ? <NumInput value={product.totalCogs} onChange={v => onChange({ totalCogs: v })} />
              : usd(product.totalCogs)
            }
          </Row>

          <SectionDivider title="Margin" />
          <Row label="NB GP%" highlight>
            {isEditing
              ? <NumInput value={product.nbGpPercent} onChange={v => onChange({ nbGpPercent: v })} />
              : pct(product.nbGpPercent)
            }
          </Row>
          <Row label="PGUS Margin">
            {isEditing
              ? <NumInput value={product.pgusMargin} onChange={v => onChange({ pgusMargin: v })} />
              : pct(product.pgusMargin)
            }
          </Row>
          <Row label="FOB NB with PGUS Margin">
            {isEditing
              ? <NumInput value={product.fobNbWithPgusMargin} onChange={v => onChange({ fobNbWithPgusMargin: v })} />
              : usd(product.fobNbWithPgusMargin)
            }
          </Row>
          <Row label="Customer Commission">
            {isEditing
              ? <NumInput value={product.customerCommission} onChange={v => onChange({ customerCommission: v })} />
              : pct(product.customerCommission)
            }
          </Row>

          <SectionDivider title="Logistics & Duties" />
          <Row label="DI Freight Rate">
            {isEditing
              ? <NumInput value={product.diFreightRate} onChange={v => onChange({ diFreightRate: v })} />
              : usd(product.diFreightRate)
            }
          </Row>
          <Row label="DO Freight Rate">
            {isEditing
              ? <NumInput value={product.doFreightRate} onChange={v => onChange({ doFreightRate: v })} />
              : usd(product.doFreightRate)
            }
          </Row>
          <Row label="Texas Warehouse Cost">
            {isEditing
              ? <NumInput value={product.texasWarehouseCost} onChange={v => onChange({ texasWarehouseCost: v })} />
              : usd(product.texasWarehouseCost)
            }
          </Row>
          <Row label="Declaration Price">
            {isEditing
              ? <NumInput value={product.declarationPrice} onChange={v => onChange({ declarationPrice: v })} />
              : usd(product.declarationPrice, 2)
            }
          </Row>
          <Row label="Duty Cost">
            {isEditing
              ? <NumInput value={product.dutyCost} onChange={v => onChange({ dutyCost: v })} />
              : usd(product.dutyCost)
            }
          </Row>
        </tbody>
      </table>

      {gp !== null && (
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">NB GP%</p>
            <span className={`text-lg font-bold ${
              gp >= 40 ? 'text-emerald-600' : gp >= 25 ? 'text-amber-600' : 'text-red-600'
            }`}>{gp.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                gp >= 40 ? 'bg-emerald-500' : gp >= 25 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(100, gp)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>0%</span>
            <span>Target: 35%</span>
            <span>100%</span>
          </div>
        </div>
      )}
    </div>
  )
}
