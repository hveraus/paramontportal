import { useState } from 'react'
import type { PatentRecord, PatentStatus, ProductDetail } from '../../types'

const INPUT_CLS = "w-full h-9 px-3 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-colors"
const SELECT_CLS = "w-full h-9 px-3 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-colors appearance-none"

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

function PatentCard({
  patent,
  isEditing,
  onEdit,
  onDelete,
}: {
  patent: PatentRecord
  isEditing: boolean
  onEdit: () => void
  onDelete: () => void
}) {
  const style = patent.status ? STATUS_STYLE[patent.status] : null

  return (
    <div className="border border-slate-200 rounded-xl p-4 space-y-4">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 leading-snug">{patent.patentName}</p>
          <p className="text-xs font-mono text-blue-700">{patent.patentNumber}</p>
        </div>
        <div className="flex items-center gap-2">
          {style && patent.status && (
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${style.bg} ${style.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
              {patent.status}
            </span>
          )}
          {isEditing && (
            <div className="flex items-center gap-1">
              <button
                onClick={onEdit}
                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                title="Edit patent"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                onClick={onDelete}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Delete patent"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
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

function emptyPatent(): PatentRecord {
  return {
    id: 'pat-' + Date.now(),
    patentName: '',
    patentNumber: '',
    applicationDate: null,
    status: 'Pending',
    files: [],
  }
}

interface Props {
  patents: PatentRecord[]
  isEditing: boolean
  onChange: (fields: Partial<ProductDetail>) => void
}

export default function PatentsTab({ patents, isEditing, onChange }: Props) {
  const [editingPatent, setEditingPatent] = useState<PatentRecord | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)

  function handleSavePatent(patent: PatentRecord) {
    if (isAddingNew) {
      onChange({ patents: [...patents, patent] })
      setIsAddingNew(false)
    } else {
      onChange({ patents: patents.map(p => p.id === patent.id ? patent : p) })
    }
    setEditingPatent(null)
  }

  function handleDeletePatent(patent: PatentRecord) {
    onChange({ patents: patents.filter(p => p.id !== patent.id) })
  }

  function handleCancel() {
    setEditingPatent(null)
    setIsAddingNew(false)
  }

  const formPatent = isAddingNew ? (editingPatent ?? emptyPatent()) : editingPatent

  if (patents.length === 0 && !isEditing) {
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

  return (
    <div className="space-y-4">
      {/* Patent cards */}
      {patents.map(patent => (
        <PatentCard
          key={patent.id}
          patent={patent}
          isEditing={isEditing}
          onEdit={() => { setEditingPatent(patent); setIsAddingNew(false) }}
          onDelete={() => handleDeletePatent(patent)}
        />
      ))}

      {/* Add / Edit form */}
      {isEditing && formPatent && (
        <div className="border border-blue-200 rounded-xl p-4 bg-blue-50/30 space-y-4">
          <p className="text-sm font-semibold text-slate-700">{isAddingNew ? 'Add Patent' : 'Edit Patent'}</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Patent Name</p>
              <input
                type="text"
                className={INPUT_CLS}
                value={formPatent.patentName}
                onChange={e => setEditingPatent({ ...formPatent, patentName: e.target.value })}
              />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Patent Number</p>
              <input
                type="text"
                className={INPUT_CLS}
                value={formPatent.patentNumber}
                onChange={e => setEditingPatent({ ...formPatent, patentNumber: e.target.value })}
              />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Application Date</p>
              <input
                type="date"
                className={INPUT_CLS}
                value={formPatent.applicationDate ?? ''}
                onChange={e => setEditingPatent({ ...formPatent, applicationDate: e.target.value || null })}
              />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Status</p>
              <select
                className={SELECT_CLS}
                value={formPatent.status ?? ''}
                onChange={e => setEditingPatent({ ...formPatent, status: (e.target.value || null) as PatentStatus | null })}
              >
                <option value="">—</option>
                <option value="Granted">Granted</option>
                <option value="Pending">Pending</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSavePatent(formPatent)}
              className="px-4 py-1.5 text-sm rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              {isAddingNew ? 'Add Patent' : 'Save Patent'}
            </button>
          </div>
        </div>
      )}

      {/* Add new button */}
      {isEditing && !formPatent && (
        <button
          onClick={() => { setEditingPatent(emptyPatent()); setIsAddingNew(true) }}
          className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-slate-300 rounded-xl text-sm text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/30 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Patent
        </button>
      )}
    </div>
  )
}
