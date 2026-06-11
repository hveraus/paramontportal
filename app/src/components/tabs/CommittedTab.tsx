import type { CommittedRecord } from '../../types'

interface CommittedTabProps {
  committedRecords: CommittedRecord[]
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function CommittedTab({ committedRecords }: CommittedTabProps) {
  const hasRecords = committedRecords.length > 0

  return (
    <div>
      {hasRecords ? (
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-36">
                  Date
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Customer
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {committedRecords.map(record => (
                <tr key={record.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Date */}
                  <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">
                    {formatDate(record.committedDate)}
                  </td>

                  {/* Customer */}
                  <td className="px-4 py-3.5">
                    {record.clientPending ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Pending (external system)
                      </span>
                    ) : (
                      <span className="text-sm text-slate-700">{record.customer}</span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <svg className="w-10 h-10 mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm">No program commitments recorded</p>
        </div>
      )}

    </div>
  )
}
