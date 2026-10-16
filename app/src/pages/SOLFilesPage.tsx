import { useMemo, useState } from 'react'
import TopBar from '../components/TopBar'
import Sidebar from '../components/Sidebar'
import Breadcrumb from '../components/Breadcrumb'
import { useNavigation } from '../context/NavigationContext'
import { MOCK_SOL_FILES } from '../mock/solFiles'
import type { SOLFile, SOLStatus } from '../types'

function formatDateTime(iso: string | null) {
  if (!iso) return null
  return new Date(iso).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

const STATUS_STYLE: Record<SOLStatus, { badge: string; dot: string; pulse?: boolean }> = {
  Imported:   { badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-500' },
  Pending:    { badge: 'bg-slate-100 text-slate-600 border border-slate-200',      dot: 'bg-slate-400'   },
  Failed:     { badge: 'bg-rose-50 text-rose-700 border border-rose-200',          dot: 'bg-rose-500'    },
  Processing: { badge: 'bg-blue-50 text-blue-700 border border-blue-200',          dot: 'bg-blue-500', pulse: true },
  Queued:     { badge: 'bg-amber-50 text-amber-700 border border-amber-200',       dot: 'bg-amber-500'   },
}

function StatusBadge({ status }: { status: SOLStatus }) {
  const s = STATUS_STYLE[status]
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full ${s.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${s.pulse ? 'animate-pulse' : ''}`} />
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

function IconSync({ spinning }: { spinning?: boolean }) {
  return (
    <svg className={`w-3.5 h-3.5 ${spinning ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )
}

function IconDownload() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  )
}

const SELECT_CLS = "h-9 px-3 pr-8 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-colors appearance-none"

type Override = { status: SOLStatus; mergeTime: string | null; mergedEntries: number }

export default function SOLFilesPage() {
  const { navigate } = useNavigation()
  const [status, setStatus] = useState<string>('all')
  // Per-file mutable-field overrides (start empty; fall back to the mock values)
  const [overrides, setOverrides] = useState<Record<string, Partial<Override>>>({})
  // Files with an import/retry in flight
  const [busy, setBusy] = useState<Set<string>>(new Set())

  const fieldsOf = (f: SOLFile) => ({
    status: overrides[f.id]?.status ?? f.status,
    mergeTime: overrides[f.id]?.mergeTime ?? f.mergeTime,
    mergedEntries: overrides[f.id]?.mergedEntries ?? f.mergedEntries,
  })

  const runImport = (f: SOLFile) => {
    if (busy.has(f.id)) return
    setBusy(prev => new Set(prev).add(f.id))
    setTimeout(() => {
      setBusy(prev => {
        const n = new Set(prev)
        n.delete(f.id)
        return n
      })
      setOverrides(prev => ({
        ...prev,
        [f.id]: { status: 'Imported', mergeTime: new Date().toISOString(), mergedEntries: f.totalEntries },
      }))
    }, 1200)
  }

  const openSpreadsheet = (f: SOLFile) => {
    // Placeholder: would open the SOL spreadsheet view
    console.log('Open spreadsheet for', f.id)
  }

  const filtered = useMemo(() => {
    return MOCK_SOL_FILES
      .filter(f => status === 'all' || fieldsOf(f).status === status)
      .sort((a, b) => b.updatedTime.localeCompare(a.updatedTime))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, overrides])

  const hasFilter = status !== 'all'

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
              <label className="text-xs font-medium text-slate-500">Status</label>
              <select className={SELECT_CLS} value={status} onChange={e => setStatus(e.target.value)}>
                <option value="all">All</option>
                <option value="Imported">Imported</option>
                <option value="Processing">Processing</option>
                <option value="Queued">Queued</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
            {hasFilter && (
              <button
                onClick={() => setStatus('all')}
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
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">Updated Time</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">Merge Time</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-36">Merged / Total</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-400">No SOL files match the current filters.</td>
                  </tr>
                ) : (
                  filtered.map(f => {
                    const { status: st, mergeTime, mergedEntries } = fieldsOf(f)
                    const isBusy = busy.has(f.id)
                    const mergeLabel = formatDateTime(mergeTime)
                    return (
                      <tr
                        key={f.id}
                        onClick={() => openSpreadsheet(f)}
                        className="hover:bg-slate-50/60 transition-colors cursor-pointer"
                      >
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center gap-2.5">
                            <IconFile />
                            <span className="font-medium text-slate-800">{f.name}</span>
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          {isBusy
                            ? <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600"><IconSync spinning /> Importing…</span>
                            : <StatusBadge status={st} />}
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{formatDateTime(f.updatedTime)}</td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          {mergeLabel
                            ? <span className="text-slate-500">{mergeLabel}</span>
                            : <span className="text-slate-300">—</span>}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className="font-medium text-slate-700">{mergedEntries}</span>
                          <span className="text-slate-400"> / {f.totalEntries}</span>
                        </td>
                        <td className="px-5 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                          {st === 'Pending' && (
                            <button
                              onClick={() => runImport(f)}
                              disabled={isBusy}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg
                                border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-60 transition-colors whitespace-nowrap"
                            >
                              <IconDownload />
                              Import
                            </button>
                          )}
                          {st === 'Failed' && (
                            <button
                              onClick={() => runImport(f)}
                              disabled={isBusy}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg
                                border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 disabled:opacity-60 transition-colors whitespace-nowrap"
                            >
                              <IconSync spinning={isBusy} />
                              Re-Try
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
