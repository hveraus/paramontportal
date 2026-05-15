import { useState } from 'react'
import type { CertificationRecord, CertificationType, ProductDetail } from '../../types'

const INPUT_CLS = "w-full h-9 px-3 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-colors"
const SELECT_CLS = "w-full h-9 px-3 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-colors appearance-none"

const TYPE_STYLE: Record<CertificationType, { bg: string; text: string }> = {
  CE:    { bg: 'bg-blue-50',    text: 'text-blue-700'    },
  FCC:   { bg: 'bg-purple-50',  text: 'text-purple-700'  },
  RoHS:  { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  Other: { bg: 'bg-slate-100',  text: 'text-slate-600'   },
}

function formatDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function isExpired(expiryDate: string | null) {
  if (!expiryDate) return false
  return new Date(expiryDate) < new Date()
}

function FileIcon() {
  return (
    <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

function CertCard({
  cert,
  isEditing,
  onEdit,
  onDelete,
}: {
  cert: CertificationRecord
  isEditing: boolean
  onEdit: () => void
  onDelete: () => void
}) {
  const style = TYPE_STYLE[cert.certType]
  const expired = isExpired(cert.expiryDate)

  return (
    <div className="border border-slate-200 rounded-xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-md ${style.bg} ${style.text}`}>
            {cert.certType}
          </span>
          <p className="text-xs font-mono text-slate-600 pt-0.5">{cert.certNumber}</p>
        </div>
        <div className="flex items-center gap-2">
          {cert.expiryDate && (
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${
              expired ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${expired ? 'bg-red-500' : 'bg-emerald-500'}`} />
              {expired ? 'Expired' : 'Valid'}
            </span>
          )}
          {isEditing && (
            <div className="flex items-center gap-1">
              <button
                onClick={onEdit}
                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                title="Edit certification"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                onClick={onDelete}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Delete certification"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">Cert Date</p>
          <p className="text-sm text-slate-700">{formatDate(cert.certDate)}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">Expiry Date</p>
          <p className={`text-sm ${expired ? 'text-red-600 font-medium' : 'text-slate-700'}`}>
            {formatDate(cert.expiryDate)}
          </p>
        </div>
      </div>

      {/* Files */}
      {cert.files.length > 0 && (
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">Cert Files</p>
          <div className="space-y-1.5">
            {cert.files.map(file => (
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

      {cert.files.length === 0 && (
        <p className="text-xs text-slate-300 italic">No files attached</p>
      )}
    </div>
  )
}

function emptyCert(): CertificationRecord {
  return {
    id: 'cert-' + Date.now(),
    certType: 'CE',
    certNumber: '',
    certDate: null,
    expiryDate: null,
    files: [],
  }
}

interface Props {
  certifications: CertificationRecord[]
  isEditing: boolean
  onChange: (fields: Partial<ProductDetail>) => void
}

export default function CertificationsTab({ certifications, isEditing, onChange }: Props) {
  const [editingCert, setEditingCert] = useState<CertificationRecord | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)

  function handleSaveCert(cert: CertificationRecord) {
    if (isAddingNew) {
      onChange({ certifications: [...certifications, cert] })
      setIsAddingNew(false)
    } else {
      onChange({ certifications: certifications.map(c => c.id === cert.id ? cert : c) })
    }
    setEditingCert(null)
  }

  function handleDeleteCert(cert: CertificationRecord) {
    onChange({ certifications: certifications.filter(c => c.id !== cert.id) })
  }

  function handleCancel() {
    setEditingCert(null)
    setIsAddingNew(false)
  }

  const formCert = isAddingNew ? (editingCert ?? emptyCert()) : editingCert

  if (certifications.length === 0 && !isEditing) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <svg className="w-10 h-10 text-slate-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
        <p className="text-sm text-slate-400">No certifications on file for this product</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Cert cards */}
      {certifications.map(cert => (
        <CertCard
          key={cert.id}
          cert={cert}
          isEditing={isEditing}
          onEdit={() => { setEditingCert(cert); setIsAddingNew(false) }}
          onDelete={() => handleDeleteCert(cert)}
        />
      ))}

      {/* Add / Edit form */}
      {isEditing && formCert && (
        <div className="border border-blue-200 rounded-xl p-4 bg-blue-50/30 space-y-4">
          <p className="text-sm font-semibold text-slate-700">{isAddingNew ? 'Add Certification' : 'Edit Certification'}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Cert Type</p>
              <select
                className={SELECT_CLS}
                value={formCert.certType}
                onChange={e => setEditingCert({ ...formCert, certType: e.target.value as CertificationType })}
              >
                <option value="CE">CE</option>
                <option value="FCC">FCC</option>
                <option value="RoHS">RoHS</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Cert Number</p>
              <input
                type="text"
                className={INPUT_CLS}
                value={formCert.certNumber}
                onChange={e => setEditingCert({ ...formCert, certNumber: e.target.value })}
              />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Cert Date</p>
              <input
                type="date"
                className={INPUT_CLS}
                value={formCert.certDate ?? ''}
                onChange={e => setEditingCert({ ...formCert, certDate: e.target.value || null })}
              />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Expiry Date</p>
              <input
                type="date"
                className={INPUT_CLS}
                value={formCert.expiryDate ?? ''}
                onChange={e => setEditingCert({ ...formCert, expiryDate: e.target.value || null })}
              />
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
              onClick={() => handleSaveCert(formCert)}
              className="px-4 py-1.5 text-sm rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              {isAddingNew ? 'Add Certification' : 'Save Certification'}
            </button>
          </div>
        </div>
      )}

      {/* Add new button */}
      {isEditing && !formCert && (
        <button
          onClick={() => { setEditingCert(emptyCert()); setIsAddingNew(true) }}
          className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-slate-300 rounded-xl text-sm text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/30 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Certification
        </button>
      )}
    </div>
  )
}
