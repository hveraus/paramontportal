import type { ProductDetail } from '../../types'

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

function SectionDivider({ title }: { title: string }) {
  return (
    <tr>
      <td colSpan={2} className="pt-5 pb-1">
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

export default function CostTab({ product }: { product: ProductDetail }) {
  const gp = product.nbGpPercent

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-2 bg-amber-50 rounded-lg px-3 py-2 text-xs text-amber-700">
        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        Cost data is confidential. Do not share externally.
      </div>

      <table className="w-full">
        <tbody>
          <SectionDivider title="Pricing" />
          <Row label="Retail">{usd(product.retail, 2)}</Row>
          <Row label="RMB Purchase">{cny(product.rmbPurchase)}</Row>
          <Row label="Dollar Purchase">{usd(product.dollarPurchase)}</Row>
          <Row label="Est. Plating / Molding Cost (CNY)">{cny(product.estPlatingMoldingCost)}</Row>

          <SectionDivider title="COGS" />
          <Row label="NB Suggested COGS">{usd(product.nbSuggestedCogs)}</Row>
          <Row label="Finalized COGS (NB)">{usd(product.finalizedCogsNb)}</Row>
          <Row label="Total COGS" highlight>{usd(product.totalCogs)}</Row>

          <SectionDivider title="Margin" />
          <Row label="NB GP%" highlight>{pct(product.nbGpPercent)}</Row>
          <Row label="PGUS Margin">{pct(product.pgusMargin)}</Row>
          <Row label="FOB NB with PGUS Margin">{usd(product.fobNbWithPgusMargin)}</Row>
          <Row label="Customer Commission">{pct(product.customerCommission)}</Row>

          <SectionDivider title="Logistics & Duties" />
          <Row label="DI Freight Rate">{usd(product.diFreightRate)}</Row>
          <Row label="DO Freight Rate">{usd(product.doFreightRate)}</Row>
          <Row label="Texas Warehouse Cost">{usd(product.texasWarehouseCost)}</Row>
          <Row label="Declaration Price">{usd(product.declarationPrice, 2)}</Row>
          <Row label="Duty Cost">{usd(product.dutyCost)}</Row>
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
