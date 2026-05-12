import type { IterationRecord } from '../types'

function formatDate(iso: string) {
  const d = new Date(iso.replace(' ', 'T'))
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function Timeline({ records }: { records: IterationRecord[] }) {
  return (
    <div className="space-y-0">
      {records.slice(0, 10).map((rec, i, arr) => (
        <div key={rec.id} className="flex gap-4 relative">
          {i < arr.length - 1 && (
            <div className="absolute left-4 top-9 bottom-0 w-px bg-slate-100" />
          )}

          <div className="flex-shrink-0 pt-0.5">
            <img
              src={rec.operatorAvatar}
              alt={rec.operator}
              className="w-8 h-8 rounded-full border-2 border-white shadow-sm z-10 relative"
            />
          </div>

          <div className="flex-1 pb-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-slate-800">{rec.operator}</span>
              {rec.field && (
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                  {rec.field}
                </span>
              )}
              <span className="text-xs text-slate-400 ml-auto">{formatDate(rec.timestamp)}</span>
            </div>

            <p className="text-sm text-slate-600 mt-0.5">{rec.description}</p>

            {(rec.from || rec.to) && (
              <div className="flex items-center gap-2 mt-1.5 text-xs">
                {rec.from && (
                  <span className="bg-red-50 text-red-500 px-2 py-0.5 rounded line-through">
                    {rec.from}
                  </span>
                )}
                {rec.from && rec.to && (
                  <svg className="w-3 h-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
                {rec.to && (
                  <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded">
                    {rec.to}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
