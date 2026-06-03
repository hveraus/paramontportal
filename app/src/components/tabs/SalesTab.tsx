import { useMemo, useState } from 'react'
import type { SalesRecord } from '../../types'

interface SalesTabProps {
  salesRecords: SalesRecord[]
}

type Metric = 'units' | 'revenue'

// Fixed palette for up to 6 customers
const CUSTOMER_COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ef4444', // red
  '#14b8a6', // teal
]

function fmtMonth(period: string) {
  // "2025-01" → "Jan '25"
  const [y, m] = period.split('-')
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(m) - 1] ?? m
  return `${month} '${y.slice(2)}`
}

function fmtValue(v: number, metric: Metric) {
  if (metric === 'revenue') {
    if (v >= 1000) return `$${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k`
    return `$${v}`
  }
  if (v >= 1000) return `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k`
  return `${v}`
}

export default function SalesTab({ salesRecords }: SalesTabProps) {
  const [metric, setMetric] = useState<Metric>('units')

  const { periods, customers, byPeriod, byCustomer, grandTotal } = useMemo(() => {
    const periodSet = Array.from(new Set(salesRecords.map(r => r.period))).sort()
    const customerSet = Array.from(new Set(salesRecords.map(r => r.customer)))

    // Total per period (for trend chart)
    const byPeriod = periodSet.map(p => {
      const rows = salesRecords.filter(r => r.period === p)
      return {
        period: p,
        units: rows.reduce((s, r) => s + r.units, 0),
        revenue: rows.reduce((s, r) => s + r.revenue, 0),
      }
    })

    // Total per customer (for comparison chart), sorted desc by current metric handled later
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

    return { periods: periodSet, customers: customerSet, byPeriod, byCustomer, grandTotal }
  }, [salesRecords])

  const colorOf = (customer: string) => CUSTOMER_COLORS[customers.indexOf(customer) % CUSTOMER_COLORS.length]

  if (salesRecords.length === 0) {
    return (
      <div className="py-16 text-center text-slate-400 text-sm">No sales data available for this product.</div>
    )
  }

  // ── Trend chart geometry ───────────────────────────────────────────────
  const maxPeriodVal = Math.max(...byPeriod.map(p => p[metric]), 1)
  const peakPeriod = byPeriod.reduce((a, b) => (b[metric] > a[metric] ? b : a))

  // ── Customer comparison ────────────────────────────────────────────────
  const customersSorted = [...byCustomer].sort((a, b) => b[metric] - a[metric])
  const maxCustomerVal = Math.max(...customersSorted.map(c => c[metric]), 1)

  return (
    <div className="space-y-6">
      {/* Header: metric toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">Sales Performance</h3>
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
                metric === m ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {m === 'units' ? 'Units' : 'Revenue'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">
            Total {metric === 'units' ? 'Units' : 'Revenue'}
          </p>
          <p className="text-xl font-bold text-slate-900">{fmtValue(grandTotal[metric], metric)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Peak Month</p>
          <p className="text-xl font-bold text-slate-900">{fmtMonth(peakPeriod.period)}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{fmtValue(peakPeriod[metric], metric)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Top Customer</p>
          <p className="text-xl font-bold text-slate-900 truncate">{customersSorted[0]?.customer}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {Math.round((customersSorted[0][metric] / grandTotal[metric]) * 100)}% of total
          </p>
        </div>
      </div>

      {/* ── Trend chart (monthly total) ──────────────────────────────── */}
      <div className="rounded-xl border border-slate-200 p-5">
        <h4 className="text-xs font-semibold text-slate-600 mb-4">
          Monthly {metric === 'units' ? 'Units Sold' : 'Revenue'}
        </h4>
        <div className="flex items-end gap-2 h-44">
          {byPeriod.map(p => {
            const h = (p[metric] / maxPeriodVal) * 100
            const isPeak = p.period === peakPeriod.period
            return (
              <div key={p.period} className="flex-1 flex flex-col items-center justify-end h-full group">
                <span className="text-[10px] font-medium text-slate-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {fmtValue(p[metric], metric)}
                </span>
                <div
                  className={`w-full rounded-t-md transition-all ${
                    isPeak ? 'bg-blue-600' : 'bg-blue-300 group-hover:bg-blue-400'
                  }`}
                  style={{ height: `${Math.max(h, 2)}%` }}
                  title={`${fmtMonth(p.period)}: ${fmtValue(p[metric], metric)}`}
                />
              </div>
            )
          })}
        </div>
        <div className="flex gap-2 mt-2">
          {byPeriod.map(p => (
            <span key={p.period} className="flex-1 text-center text-[9px] text-slate-400 whitespace-nowrap">
              {fmtMonth(p.period)}
            </span>
          ))}
        </div>
      </div>

      {/* ── Customer comparison ──────────────────────────────────────── */}
      <div className="rounded-xl border border-slate-200 p-5">
        <h4 className="text-xs font-semibold text-slate-600 mb-4">
          {metric === 'units' ? 'Units' : 'Revenue'} by Customer
        </h4>
        <div className="space-y-3">
          {customersSorted.map(c => {
            const pct = (c[metric] / maxCustomerVal) * 100
            const share = Math.round((c[metric] / grandTotal[metric]) * 100)
            return (
              <div key={c.customer} className="flex items-center gap-3">
                <span className="w-24 text-xs text-slate-600 truncate text-right flex-shrink-0">{c.customer}</span>
                <div className="flex-1 h-6 bg-slate-100 rounded-md overflow-hidden">
                  <div
                    className="h-full rounded-md flex items-center justify-end px-2 transition-all"
                    style={{ width: `${Math.max(pct, 6)}%`, backgroundColor: colorOf(c.customer) }}
                  >
                    <span className="text-[10px] font-semibold text-white whitespace-nowrap">
                      {fmtValue(c[metric], metric)}
                    </span>
                  </div>
                </div>
                <span className="w-10 text-[11px] text-slate-400 text-right flex-shrink-0">{share}%</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Per-customer monthly breakdown (stacked legend table) ─────── */}
      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
          <h4 className="text-xs font-semibold text-slate-600">Monthly Breakdown by Customer</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Customer
                </th>
                {periods.map(p => (
                  <th key={p} className="text-right px-3 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    {fmtMonth(p)}
                  </th>
                ))}
                <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customersSorted.map(c => (
                <tr key={c.customer} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: colorOf(c.customer) }} />
                      <span className="text-xs font-medium text-slate-700">{c.customer}</span>
                    </span>
                  </td>
                  {periods.map(p => {
                    const rec = salesRecords.find(r => r.customer === c.customer && r.period === p)
                    return (
                      <td key={p} className="text-right px-3 py-2.5 text-xs text-slate-500 tabular-nums whitespace-nowrap">
                        {rec ? fmtValue(rec[metric], metric) : <span className="text-slate-300">—</span>}
                      </td>
                    )
                  })}
                  <td className="text-right px-4 py-2.5 text-xs font-semibold text-slate-800 tabular-nums whitespace-nowrap">
                    {fmtValue(c[metric], metric)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-slate-50">
                <td className="px-4 py-2.5 text-xs font-semibold text-slate-700 whitespace-nowrap">Total</td>
                {byPeriod.map(p => (
                  <td key={p.period} className="text-right px-3 py-2.5 text-xs font-semibold text-slate-700 tabular-nums whitespace-nowrap">
                    {fmtValue(p[metric], metric)}
                  </td>
                ))}
                <td className="text-right px-4 py-2.5 text-xs font-bold text-slate-900 tabular-nums whitespace-nowrap">
                  {fmtValue(grandTotal[metric], metric)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
