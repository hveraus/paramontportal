import { useMemo, useState } from 'react'
import TopBar from '../components/TopBar'
import Sidebar from '../components/Sidebar'
import Breadcrumb from '../components/Breadcrumb'
import { useNavigation } from '../context/NavigationContext'
import { MOCK_SOL_FILES } from '../mock/solFiles'
import type { SOLStatus } from '../types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function StatusBadge({ status }: { status: SOLStatus }) {
  const cls = status === 'Open'
    ? 'bg-blue-50 text-blue-700 border border-blue-200'
    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'Open' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
      {status}
    </span>
  )
}

function IconFile() {
  return (
    <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

function IconSpreadsheet() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 9h16M4 14h16M10 4v16" />
    </svg>
  )
}

const SELECT_CLS = "h-9 px-3 pr-8 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-colors appearance-none"

export default function SOLFilesPage() {
  const { navigate } = useNavigation()
  const [year, setYear] = useState<string>('all')
  const [customer, setCustomer] = useState<string>('all')
  const [status, setStatus] = useState<string>('all')

  const years = useMemo(
    () => Array.from(new Set(MOCK_SOL_FILES.map(f => f.date.slice(0, 4)))).sort().reverse(),
    [],
  )
  const customers = useMemo(
    () => Array.from(new Set(MOCK_SOL_FILES.map(f => f.customer))).sort(),
    [],
  )

  const filtered = useMemo(() => {
    return MOCK_SOL_FILES
      .filter(f => year === 'all' || f.date.slice(0, 4) === year)
      .filter(f => customer === 'all' || f.customer === customer)
      .filter(f => status === 'all' || f.status === status)
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [year, customer, status])

  const hasFilter = year !== 'all' || customer !== 'all' || status !== 'all'

  return (
    <div className="min-h-screen bg-slate-100">
      <TopBar />
      <div className="flex">
        <Sidebar topOffset={56} />

        <div className="flex-1 min-w-0 px-6 py-5 space-y-5">
          <Breadcrumb crumbs={[
            { label: 'Home', href: '#' },
            { label: 'Products', href: '#' },
            { label: 'SOL Files' },
          ]} />

          {/* Header */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <button
                onClick={() => navigate('products')}
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Products
              </button>
              <h1 className="text-xl font-bold text-slate-900">SOL Files</h1>
              <p className="text-sm text-slate-400 mt-0.5">Statement of Line documents across customers</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-4 py-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-500">Year</label>
              <select className={SELECT_CLS} value={year} onChange={e => setYear(e.target.value)}>
                <option value="all">All Years</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-500">Customer</label>
              <select className={SELECT_CLS} value={customer} onChange={e => setCustomer(e.target.value)}>
                <option value="all">All Customers</option>
                {customers.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-500">Status</label>
              <select className={SELECT_CLS} value={status} onChange={e => setStatus(e.target.value)}>
                <option value="all">All</option>
                <option value="Open">Open</option>
                <option value="Merged">Merged</option>
              </select>
            </div>
            {hasFilter && (
              <button
                onClick={() => { setYear('all'); setCustomer('all'); setStatus('all') }}
                className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors ml-1"
              >
                Reset
              </button>
            )}
            <span className="ml-auto text-xs text-slate-400">{filtered.length} files</span>
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-36">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">Customer</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-400">No SOL files match the current filters.</td>
                  </tr>
                ) : (
                  filtered.map(f => (
                    <tr key={f.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{formatDate(f.date)}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-2.5">
                          <IconFile />
                          <span className="font-medium text-slate-800">{f.name}</span>
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">{f.customer}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={f.status} /></td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg
                            border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-300 transition-colors whitespace-nowrap"
                        >
                          <IconSpreadsheet />
                          View Spreadsheet
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
