import type { SourceFile } from '../../types'

interface Props {
  sourceFiles: SourceFile[]
}

export default function SourceFilesTab({ sourceFiles }: Props) {
  if (sourceFiles.length === 0) {
    return <p className="text-sm text-slate-400 py-6 text-center">No source files uploaded.</p>
  }

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
      {sourceFiles.map(f => (
        <div key={f.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
          {/* Ai icon */}
          <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center flex-shrink-0">
            <span className="text-[11px] font-bold text-orange-600 leading-none">Ai</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{f.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">{f.size} · {f.uploadedAt} · {f.uploadedBy}</p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Open folder */}
            <button
              title="Open folder"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
