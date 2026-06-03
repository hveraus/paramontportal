import { useMemo, useState } from 'react'
import type { SalesRecord } from '../../types'

interface SalesTab2Props {
  salesRecords: SalesRecord[]
}

type Metric = 'units' | 'revenue'

const CUSTOMER_COLORS = [
  '#6366f1', // indigo
  '#06b6d4', // cyan
  '#f59e0b', // amber
  '#ec4899', // pink
  '#22c55e', // green
  '#64748b', // slate
]

function fmtMonth(period: string) {
  const [y, m] = period.split('-')
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(m) - 1] ?? m
  return `${month} '${y.slice(2)}`
}

function fmtValue(v: number, metric: Metric) {
  if (metric === 'revenue') {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`
    if (v >= 1000) return `$${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k`
    return `$${v}`
  }
  if (v >= 1000) return `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k`
  return `${v}`
}

// SVG donut arc path
function donutArc(cx: number, cy: number, rOuter: number, rInner: number, startAngle: number, endAngle: number) {
  const polar = (r: number, a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)]
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0
  const [x1, y1] = polar(rOuter, startAngle)
  const [x2, y2] = polar(rOuter, endAngle)
  const [x3, y3] = polar(rInner, endAngle)
  const [x4, y4] = polar(rInner, startAngle)
  return `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 ${largeArc} 0 ${x4} ${y4} Z`
}

export default function SalesTab2({ salesRecords }: SalesTab2Props) {
  const [metric, setMetric] = useState<Metric>('units')

  const { periods, customers, byPeriod, byCustomer, grandTotal, mom } = useMemo(() => {
    const periodSet = Array.from(new Set(salesRecords.map(r => r.period))).sort()
    const customerSet = Array.from(new Set(salesRecords.map(r => r.customer)))

    const byPeriod = periodSet.map(p => {
      const rows = salesRecords.filter(r => r.period === p)
      return {
        period: p,
        units: rows.reduce((s, r) => s + r.units, 0),
        revenue: rows.reduce((s, r) => s + r.revenue, 0),
      }
    })

    const byCustomer = customerSet.map(c => {
      const rows = salesRecords.filter(r => r.customer === c)
      return {
        customer: c,
        units: rows.reduce((s, r) => s + r.units, 0),
        revenue: rows.reduce((s, r) => s + r.revenue, 0),
      }
    })

    const grandTotal = {
      units: byPeriod.reduce((s, p) => s + p.units, 0),
      revenue: byPeriod.reduce((s, p) => s + p.revenue, 0),
    }

    // Month-over-month change (last vs previous period)
    const last = byPeriod[byPeriod.length - 1]
    const prev = byPeriod[byPeriod.length - 2]
    const mom = {
      units: prev && prev.units ? ((last.units - prev.units) / prev.units) * 100 : 0,
      revenue: prev && prev.revenue ? ((last.revenue - prev.revenue) / prev.revenue) * 100 : 0,
    }

    return { periods: periodSet, customers: customerSet, byPeriod, byCustomer, grandTotal, mom }
  }, [salesRecords])

  const colorOf = (customer: string) => CUSTOMER_COLORS[customers.indexOf(customer) % CUSTOMER_COLORS.length]

  if (salesRecords.length === 0) {
    return <div className="py-16 text-center text-slate-400 text-sm">No sales data available for this product.</div>
  }

  const customersSorted = [...byCustomer].sort((a, b) => b[metric] - a[metric])
  const lastPeriod = byPeriod[byPeriod.length - 1]
  const momVal = mom[metric]

  // ── Multi-line chart geometry ────────────────────────────────────────────
  const W = 1000, H = 320, padL = 56, padR = 16, padT = 16, padB = 28
  const innerW = W - padL - padR
  const innerH = H - padT - padB
  const maxSeriesVal = Math.max(
    ...customers.flatMap(c => periods.map(p => salesRecords.find(r => r.customer === c && r.period === p)?.[metric] ?? 0)),
    1,
  )
  const xFor = (i: number) => padL + (periods.length === 1 ? innerW / 2 : (i / (periods.length - 1)) * innerW)
  const yFor = (v: number) => padT + innerH - (v / maxSeriesVal) * innerH

  const series = customers.map(c => ({
    customer: c,
    color: colorOf(c),
    points: periods.map((p, i) => {
      const rec = salesRecords.find(r => r.customer === c && r.period === p)
      return { x: xFor(i), y: yFor(rec?.[metric] ?? 0), has: !!rec, v: rec?.[metric] ?? 0 }
    }),
  }))

  // Y gridlines (4 steps)
  const ySteps = [0, 0.25, 0.5, 0.75, 1].map(f => ({ f, v: maxSeriesVal * f, y: padT + innerH - f * innerH }))

  // ── Donut geometry ───────────────────────────────────────────────────────
  const donutTotal = customersSorted.reduce((s, c) => s + c[metric], 0)
  let acc = -Math.PI / 2
  const donutSegs = customersSorted.map(c => {
    const frac = c[metric] / donutTotal
    const start = acc
    const end = acc + frac * Math.PI * 2
    acc = end
    return { customer: c.customer, color: colorOf(c.customer), start, end, frac, value: c[metric] }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">Sales Analytics</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {fmtMonth(periods[0])} – {fmtMonth(periods[periods.length - 1])} · {customers.length} customers
          </p>
        </div>
        <div className="inline-flex rounded-lg border border-slate-200 overflow-hidden text-xs font-medium">
          {(['units', 'revenue'] as Metric[]).map(m => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`px-3 py-1.5 transition-colors ${
                metric === m ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {m === 'units' ? 'Units' : 'Revenue'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI strip with deltas */}
      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-indigo-400 mb-1">Lifetime Total</p>
          <p className="text-xl font-bold text-slate-900">{fmtValue(grandTotal[metric], metric)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Latest Month</p>
          <p className="text-xl font-bold text-slate-900">{fmtValue(lastPeriod[metric], metric)}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{fmtMonth(lastPeriod.period)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">MoM Change</p>
          <p className={`text-xl font-bold inline-flex items-center gap-1 ${momVal >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            <svg className={`w-4 h-4 ${momVal >= 0 ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            {Math.abs(momVal).toFixed(1)}%
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Top Customer</p>
          <p className="text-xl font-bold text-slate-900 truncate">{customersSorted[0]?.customer}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{Math.round((customersSorted[0][metric] / grandTotal[metric]) * 100)}% share</p>
        </div>
      </div>

      {/* Multi-line trend chart */}
      <div className="rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-slate-600">
            {metric === 'units' ? 'Units' : 'Revenue'} Trend by Customer
          </h4>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {customers.map(c => (
              <span key={c} className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorOf(c) }} />
                {c}
              </span>
            ))}
          </div>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 'auto' }} preserveAspectRatio="none">
          {/* Gridlines + y labels */}
          {ySteps.map(s => (
            <g key={s.f}>
              <line x1={padL} y1={s.y} x2={W - padR} y2={s.y} stroke="#f1f5f9" strokeWidth={1} />
              <text x={padL - 8} y={s.y + 4} textAnchor="end" className="fill-slate-400" style={{ fontSize: 13 }}>
                {fmtValue(Math.round(s.v), metric)}
              </text>
            </g>
          ))}
          {/* X labels */}
          {periods.map((p, i) => (
            <text key={p} x={xFor(i)} y={H - 6} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 13 }}>
              {fmtMonth(p)}
            </text>
          ))}
          {/* Series lines */}
          {series.map(s => (
            <g key={s.customer}>
              <polyline
                fill="none"
                stroke={s.color}
                strokeWidth={2.5}
                strokeLinejoin="round"
                strokeLinecap="round"
                points={s.points.map(pt => `${pt.x},${pt.y}`).join(' ')}
              />
              {s.points.map((pt, i) => (
                <circle key={i} cx={pt.x} cy={pt.y} r={3} fill="#fff" stroke={s.color} strokeWidth={2}>
                  <title>{`${s.customer} · ${fmtMonth(periods[i])}: ${fmtValue(pt.v, metric)}`}</title>
                </circle>
              ))}
            </g>
          ))}
        </svg>
      </div>

      {/* Donut + customer share */}
      <div className="rounded-xl border border-slate-200 p-5">
        <h4 className="text-xs font-semibold text-slate-600 mb-4">Customer Share</h4>
        <div className="flex items-center gap-8">
          <div className="relative flex-shrink-0">
            <svg width={180} height={180} viewBox="0 0 180 180">
              {donutSegs.map(seg => (
                <path key={seg.customer} d={donutArc(90, 90, 80, 50, seg.start, seg.end)} fill={seg.color}>
                  <title>{`${seg.customer}: ${fmtValue(seg.value, metric)} (${Math.round(seg.frac * 100)}%)`}</title>
                </path>
              ))}
              <text x={90} y={84} textAnchor="middle" className="fill-slate-900" style={{ fontSize: 22, fontWeight: 700 }}>
                {fmtValue(grandTotal[metric], metric)}
              </text>
              <text x={90} y={104} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 12 }}>
                {metric === 'units' ? 'total units' : 'total revenue'}
              </text>
            </svg>
          </div>
          <div className="flex-1 space-y-2.5">
            {donutSegs.map(seg => (
              <div key={seg.customer} className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: seg.color }} />
                <span className="text-sm text-slate-600 flex-1 truncate">{seg.customer}</span>
                <span className="text-sm font-semibold text-slate-800 tabular-nums">{fmtValue(seg.value, metric)}</span>
                <span className="text-xs text-slate-400 w-10 text-right tabular-nums">{Math.round(seg.frac * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
