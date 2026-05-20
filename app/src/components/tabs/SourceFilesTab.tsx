import { useState } from 'react'
import type { SourceFile } from '../../types'

// Deterministic mock link + password per file id
function mockShareData(fileId: string) {
  const hash = fileId.replace(/[^a-z0-9]/gi, '').slice(-6).padStart(6, '0')
  return {
    link: `https://share.paramontportal.com/f/${hash}`,
    password: `PM-${hash.toUpperCase()}`,
  }
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <button
      onClick={copy}
      className="flex-shrink-0 px-2.5 py-1.5 text-xs rounded-md border border-slate-200
        text-slate-500 hover:bg-slate-50 transition-colors"
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

interface Props {
  sourceFiles: SourceFile[]
}

export default function SourceFilesTab({ sourceFiles }: Props) {
  const [sharingFile, setSharingFile] = useState<SourceFile | null>(null)

  if (sourceFiles.length === 0) {
    return <p className="text-sm text-slate-400 py-6 text-center">No source files uploaded.</p>
  }

  const share = sharingFile ? mockShareData(sharingFile.id) : null

  return (
    <>
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
              {/* Share */}
              <button
                title="Share"
                onClick={() => setSharingFile(f)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              {/* Download */}
              <button
                title="Download"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Share modal */}
      {sharingFile && share && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={() => setSharingFile(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-[400px] mx-4 overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-5 pb-4 border-b border-slate-100">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Share file</h3>
                  <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[280px]">{sharingFile.name}</p>
                </div>
                <button
                  onClick={() => setSharingFile(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors mt-0.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              {/* Link */}
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Share link</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                    <p className="text-sm text-slate-700 truncate font-mono">{share.link}</p>
                  </div>
                  <CopyButton text={share.link} />
                </div>
              </div>

              {/* Password */}
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Access password</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                    <p className="text-sm text-slate-700 font-mono tracking-widest">{share.password}</p>
                  </div>
                  <CopyButton text={share.password} />
                </div>
              </div>

              <p className="text-xs text-slate-400">
                Anyone with this link and password can download the file. Share responsibly.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
