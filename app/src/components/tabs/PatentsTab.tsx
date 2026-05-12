import type { PatentRecord, PatentStatus } from '../../types'

const STATUS_STYLE: Record<PatentStatus, { bg: string; text: string; dot: string }> = {
  Granted: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Pending: { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
  Expired: { bg: 'bg-slate-100',  text: 'text-slate-500',   dot: 'bg-slate-400'   },
}

function formatDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function FileIcon() {
  return (
    <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

function PatentCard({ patent }: { patent: PatentRecord }) {
  const style = patent.status ? STATUS_STYLE[patent.status] : null

  return (
    <div className="border border-slate-200 rounded-xl p-4 space-y-4">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 leading-snug">{patent.patentName}</p>
          <p className="text-xs font-mono text-blue-700">{patent.patentNumber}</p>
        </div>
        {style && patent.status && (
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${style.bg} ${style.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
            {patent.status}
          </span>
        )}
      </div>

      {/* Date */}
      <div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">Application Date</p>
        <p className="text-sm text-slate-700">{formatDate(patent.applicationDate)}</p>
      </div>

      {/* Files */}
      {patent.files.length > 0 && (
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">Patent Files</p>
          <div className="space-y-1.5">
            {patent.files.map(file => (
              <a
                key={file.id}
                href={file.url}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors group"
              >
                <FileIcon />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 truncate group-hover:text-blue-700 transition-colors">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-400">{file.size} · Uploaded {formatDate(file.uploadedAt)}</p>
                </div>
                <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      )}

      {patent.files.length === 0 && (
        <p className="text-xs text-slate-300 italic">No files attached</p>
      )}
    </div>
  )
}

export default function PatentsTab({ patents }: { patents: PatentRecord[] }) {
  if (patents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <svg className="w-10 h-10 text-slate-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <p className="text-sm text-slate-400">No patents on file for this product</p>
      </div>
    )
  }

  const counts = { Granted: 0, Pending: 0, Expired: 0 }
  patents.forEach(p => { if (p.status) counts[p.status]++ })

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex items-center gap-4 pb-1">
        <span className="text-xs text-slate-400">{patents.length} patent{patents.length !== 1 ? 's' : ''}</span>
        <div className="flex items-center gap-3">
          {counts.Granted > 0 && (
            <span className="flex items-center gap-1 text-xs text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {counts.Granted} Granted
            </span>
          )}
          {counts.Pending > 0 && (
            <span className="flex items-center gap-1 text-xs text-amber-600">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {counts.Pending} Pending
            </span>
          )}
          {counts.Expired > 0 && (
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              {counts.Expired} Expired
            </span>
          )}
        </div>
      </div>

      {/* Patent cards */}
      {patents.map(patent => (
        <PatentCard key={patent.id} patent={patent} />
      ))}
    </div>
  )
}
