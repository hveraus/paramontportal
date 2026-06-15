import { useRef, useState } from 'react'
import type { PatentRecord, PatentFile, ProductDetail } from '../../types'

const INPUT_CLS = "w-full h-9 px-3 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-colors"

function formatDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatBytes(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_048_576).toFixed(1)} MB`
  if (bytes >= 1_000)     return `${Math.round(bytes / 1_024)} KB`
  return `${bytes} B`
}

function FileIcon() {
  return (
    <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

// ── Read-only card ─────────────────────────────────────────────────────────

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
  return (
    <div className="border border-slate-200 rounded-xl p-4 space-y-4">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 leading-snug">{patent.patentName}</p>
          <p className="text-xs font-mono text-blue-700">{patent.patentNumber}</p>
        </div>
        {isEditing && (
          <div className="flex items-center gap-1 flex-shrink-0">
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

      {/* Grant date */}
      <div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">Grant Date</p>
        <p className="text-sm text-slate-700">{formatDate(patent.grantDate)}</p>
      </div>

      {/* PDF attachments */}
      <div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">PDF Attachments</p>
        {patent.files.length > 0 ? (
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
        ) : (
          <p className="text-xs text-slate-300 italic">No PDF attached</p>
        )}
      </div>
    </div>
  )
}

function emptyPatent(): PatentRecord {
  return {
    id: 'pat-' + Date.now(),
    patentName: '',
    patentNumber: '',
    grantDate: null,
    files: [],
  }
}

// ── Edit / add form ──────────────────────────────────────────────────────

function PatentForm({
  patent,
  isNew,
  onChange,
  onSave,
  onCancel,
}: {
  patent: PatentRecord
  isNew: boolean
  onChange: (p: PatentRecord) => void
  onSave: () => void
  onCancel: () => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)

  const addFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return
    const today = new Date().toISOString().slice(0, 10)
    const added: PatentFile[] = Array.from(list).map((f, i) => ({
      id: `pf-${Date.now()}-${i}`,
      name: f.name,
      url: '#',
      size: formatBytes(f.size),
      uploadedAt: today,
    }))
    onChange({ ...patent, files: [...patent.files, ...added] })
    if (fileRef.current) fileRef.current.value = ''
  }

  const removeFile = (id: string) =>
    onChange({ ...patent, files: patent.files.filter(f => f.id !== id) })

  const canSave = patent.patentName.trim() !== '' && patent.patentNumber.trim() !== ''

  return (
    <div className="border border-blue-200 rounded-xl p-4 bg-blue-50/30 space-y-4">
      <p className="text-sm font-semibold text-slate-700">{isNew ? 'Add Patent' : 'Edit Patent'}</p>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Patent Name</p>
          <input
            type="text"
            className={INPUT_CLS}
            value={patent.patentName}
            onChange={e => onChange({ ...patent, patentName: e.target.value })}
          />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Patent Number</p>
          <input
            type="text"
            className={INPUT_CLS}
            value={patent.patentNumber}
            onChange={e => onChange({ ...patent, patentNumber: e.target.value })}
          />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Grant Date</p>
          <input
            type="date"
            className={INPUT_CLS}
            value={patent.grantDate ?? ''}
            onChange={e => onChange({ ...patent, grantDate: e.target.value || null })}
          />
        </div>
      </div>

      {/* PDF attachment management */}
      <div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">PDF Attachments</p>
        <div className="space-y-1.5">
          {patent.files.map(file => (
            <div key={file.id} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white border border-slate-200">
              <FileIcon />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-700 truncate">{file.name}</p>
                <p className="text-xs text-slate-400">{file.size}</p>
              </div>
              <button
                onClick={() => removeFile(file.id)}
                className="p-1 rounded text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                title="Remove file"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf"
          multiple
          className="hidden"
          onChange={e => addFiles(e.target.files)}
        />
        <button
          onClick={() => fileRef.current?.click()}
          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-dashed border-slate-300 text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/40 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Attach PDF
        </button>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={!canSave}
          className="px-4 py-1.5 text-sm rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isNew ? 'Add Patent' : 'Save Patent'}
        </button>
      </div>
    </div>
  )
}

// ── Main tab ───────────────────────────────────────────────────────────────

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

  // Read-only empty state
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
      {/* Editing empty state */}
      {patents.length === 0 && isEditing && !formPatent && (
        <p className="text-sm text-slate-400 text-center py-6">No patents yet. Add one below.</p>
      )}

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
        <PatentForm
          patent={formPatent}
          isNew={isAddingNew}
          onChange={setEditingPatent}
          onSave={() => handleSavePatent(formPatent)}
          onCancel={handleCancel}
        />
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
