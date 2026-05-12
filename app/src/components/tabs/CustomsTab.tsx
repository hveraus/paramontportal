import type { ProductDetail } from '../../types'

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
    <div className="col-span-2 flex items-center gap-3 pt-2 pb-1">
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

export default function CustomsTab({ product }: { product: ProductDetail }) {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-5">

      <SectionDivider title="Classification" />

      <Field label="HTS Category">
        {str(product.htsCategory)}
      </Field>

      <Field label="HTS Code">
        <span className="font-mono text-blue-700">{product.htsCode || '—'}</span>
      </Field>

      <SectionDivider title="Duties & Tariffs" />

      <Field label="Duty %">
        {pct(product.dutyPercent)}
      </Field>

      <Field label="Duty $">
        {usd(product.dutyDollar)}
      </Field>

      <Field label="Tariff">
        {str(product.tariff)}
      </Field>

      <Field label="15% Extra Tariff">
        {pct(product.extraTariff15)}
      </Field>

      <Field label="Total Duty Rate">
        <span className={`font-semibold ${product.totalDutyRate !== null && product.totalDutyRate > 20 ? 'text-orange-600' : 'text-slate-800'}`}>
          {product.totalDutyRate !== null ? `${product.totalDutyRate.toFixed(1)}%` : '—'}
        </span>
      </Field>

      <Field label="DA (Defective Allowance)">
        {pct(product.defectiveAllowance)}
      </Field>

    </div>
  )
}
