import { useState } from 'react'
import type { QualityRecord, QualityStatus, QualityAttachment, ProductImage, ProductDetail } from '../../types'
import StatusTag from '../StatusTag'

const INPUT_CLS = "w-full h-9 px-3 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-colors"
const SELECT_CLS = "w-full h-9 px-3 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-colors appearance-none"

const QC_VARIANT: Record<QualityStatus, 'green' | 'red' | 'yellow'> = {
  PASS: 'green', FAIL: 'red', PENDING: 'yellow',
}

function formatDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function SectionLabel({ title, count }: { title: string; count?: number }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{title}</p>
      {count !== undefined && (
        <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">{count}</span>
      )}
    </div>
  )
}

function AttachmentRow({ att }: { att: QualityAttachment }) {
  return (
    <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors group">
      <div className="w-8 h-8 bg-red-50 rounded-md flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">{att.name}</p>
        <p className="text-xs text-slate-400">{att.size} · {att.uploadedAt} · {att.uploadedBy}</p>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50 transition-colors">Preview</button>
        <button className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1 rounded hover:bg-slate-100 transition-colors flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </button>
      </div>
    </div>
  )
}

function ImageGrid({ images }: { images: ProductImage[] }) {
  if (images.length === 0) return <p className="text-xs text-slate-300 italic">No images</p>
  return (
    <div className="grid grid-cols-4 gap-2">
      {images.map(img => (
        <div key={img.id} className="group relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer">
          <img src={img.url} alt={img.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        </div>
      ))}
    </div>
  )
}

function DetailPanel({ record }: { record: QualityRecord }) {
  const productRenders   = record.images.filter(i => i.type === 'Product Render')
  const packagingRenders = record.images.filter(i => i.type === 'Packaging Render')
  const referenceImages  = record.images.filter(i => i.type === 'Reference Images')

  return (
    <div className="border border-slate-200 rounded-xl p-5 space-y-5 bg-slate-50/50">
      {/* Status row */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Quality Status</p>
          <StatusTag label={record.qualityStatus} variant={QC_VARIANT[record.qualityStatus]} />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Inspection Date</p>
          <p className="text-sm text-slate-800">{formatDate(record.qualityDate)}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">QC Owner</p>
          {record.qualityOwner
            ? <div className="flex items-center gap-2">
                <img src={record.qualityOwner.avatar} alt={record.qualityOwner.name} className="w-5 h-5 rounded-full" />
                <span className="text-sm text-slate-800">{record.qualityOwner.name}</span>
              </div>
            : <span className="text-slate-300 text-sm">—</span>
          }
        </div>
      </div>

      {/* Fail reason */}
      {record.failReason && (
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Fail Reason</p>
          <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{record.failReason}</p>
        </div>
      )}

      {/* Test Reports */}
      <div>
        <SectionLabel title="Test Reports" count={record.attachments.length} />
        {record.attachments.length > 0
          ? <div className="space-y-1.5">{record.attachments.map(att => <AttachmentRow key={att.id} att={att} />)}</div>
          : <p className="text-xs text-slate-300 italic">No test reports uploaded</p>
        }
      </div>

      {/* Images */}
      {referenceImages.length > 0 && (
        <div>
          <SectionLabel title="Reference Images" count={referenceImages.length} />
          <ImageGrid images={referenceImages} />
        </div>
      )}
      {productRenders.length > 0 && (
        <div>
          <SectionLabel title="Product Render" count={productRenders.length} />
          <ImageGrid images={productRenders} />
        </div>
      )}
      {packagingRenders.length > 0 && (
        <div>
          <SectionLabel title="Packaging Render" count={packagingRenders.length} />
          <ImageGrid images={packagingRenders} />
        </div>
      )}
    </div>
  )
}

interface Props {
  qualityRecords: QualityRecord[]
  isEditing: boolean
  onChange: (fields: Partial<ProductDetail>) => void
}

function emptyRecord(): QualityRecord {
  return {
    id: 'qr-' + Date.now(),
    qualityStatus: 'PENDING',
    qualityDate: null,
    qualityOwner: null,
    failReason: '',
    attachments: [],
    images: [],
  }
}

export default function QualityTab({ qualityRecords, isEditing, onChange }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(
    qualityRecords.length > 0 ? qualityRecords[0].id : null
  )
  const [editingRecord, setEditingRecord] = useState<QualityRecord | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)

  const selected = qualityRecords.find(r => r.id === selectedId) ?? null

  function handleSaveRecord(record: QualityRecord) {
    if (isAddingNew) {
      onChange({ qualityRecords: [...qualityRecords, record] })
      setIsAddingNew(false)
    } else {
      onChange({ qualityRecords: qualityRecords.map(r => r.id === record.id ? record : r) })
      setEditingRecord(null)
    }
  }

  function handleDeleteRecord(record: QualityRecord) {
    onChange({ qualityRecords: qualityRecords.filter(r => r.id !== record.id) })
    if (selectedId === record.id) setSelectedId(null)
  }

  function handleCancelForm() {
    setEditingRecord(null)
    setIsAddingNew(false)
  }

  const formRecord = isAddingNew ? (editingRecord ?? emptyRecord()) : editingRecord

  if (qualityRecords.length === 0 && !isEditing) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <svg className="w-10 h-10 text-slate-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-slate-400">No inspection records for this product</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Record list */}
      {(qualityRecords.length > 0 || isEditing) && (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-4 py-2.5">Status</th>
                <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-4 py-2.5">Inspection Date</th>
                <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-4 py-2.5">QC Owner</th>
                <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-4 py-2.5">Reports</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {qualityRecords.map((record) => {
                const isSelected = record.id === selectedId
                return (
                  <tr
                    key={record.id}
                    onClick={() => !isEditing && setSelectedId(isSelected ? null : record.id)}
                    className={`border-b border-slate-100 last:border-0 transition-colors
                      ${isEditing ? '' : 'cursor-pointer'}
                      ${isSelected && !isEditing ? 'bg-blue-50/60' : 'hover:bg-slate-50'}`}
                  >
                    <td className="px-4 py-3">
                      <StatusTag label={record.qualityStatus} variant={QC_VARIANT[record.qualityStatus]} />
                    </td>
                    <td className="px-4 py-3 text-slate-700">{formatDate(record.qualityDate)}</td>
                    <td className="px-4 py-3">
                      {record.qualityOwner
                        ? <div className="flex items-center gap-2">
                            <img src={record.qualityOwner.avatar} alt={record.qualityOwner.name} className="w-5 h-5 rounded-full" />
                            <span className="text-slate-700">{record.qualityOwner.name}</span>
                          </div>
                        : <span className="text-slate-300">—</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-slate-500">{record.attachments.length} file{record.attachments.length !== 1 ? 's' : ''}</td>
                    <td className="px-4 py-3 text-right">
                      {isEditing
                        ? <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={e => { e.stopPropagation(); setEditingRecord(record); setIsAddingNew(false) }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Edit record"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); handleDeleteRecord(record) }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete record"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        : <svg
                            className={`w-4 h-4 text-slate-400 transition-transform inline-block ${isSelected ? 'rotate-180' : ''}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                      }
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit form */}
      {isEditing && formRecord && (
        <div className="border border-blue-200 rounded-xl p-4 bg-blue-50/30 space-y-4">
          <p className="text-sm font-semibold text-slate-700">{isAddingNew ? 'Add Quality Record' : 'Edit Quality Record'}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Status</p>
              <select
                className={SELECT_CLS}
                value={formRecord.qualityStatus}
                onChange={e => {
                  const updated = { ...formRecord, qualityStatus: e.target.value as QualityStatus }
                  isAddingNew ? setEditingRecord(updated) : setEditingRecord(updated)
                }}
              >
                <option value="PASS">PASS</option>
                <option value="FAIL">FAIL</option>
                <option value="PENDING">PENDING</option>
              </select>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Inspection Date</p>
              <input
                type="date"
                className={INPUT_CLS}
                value={formRecord.qualityDate ?? ''}
                onChange={e => {
                  const updated = { ...formRecord, qualityDate: e.target.value || null }
                  setEditingRecord(updated)
                }}
              />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">QC Owner Name</p>
              <input
                type="text"
                className={INPUT_CLS}
                placeholder="Owner name"
                value={formRecord.qualityOwner?.name ?? ''}
                onChange={e => {
                  const name = e.target.value
                  const updated = {
                    ...formRecord,
                    qualityOwner: name
                      ? { id: formRecord.qualityOwner?.id ?? ('owner-' + Date.now()), name, avatar: '', team: 'US' as const }
                      : null
                  }
                  setEditingRecord(updated)
                }}
              />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Fail Reason</p>
              <input
                type="text"
                className={INPUT_CLS}
                placeholder="Reason (if FAIL)"
                value={formRecord.failReason ?? ''}
                onChange={e => {
                  const updated = { ...formRecord, failReason: e.target.value }
                  setEditingRecord(updated)
                }}
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={handleCancelForm}
              className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSaveRecord(formRecord)}
              className="px-4 py-1.5 text-sm rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              {isAddingNew ? 'Add Record' : 'Save Record'}
            </button>
          </div>
        </div>
      )}

      {/* Add new button */}
      {isEditing && !formRecord && (
        <button
          onClick={() => { setEditingRecord(emptyRecord()); setIsAddingNew(true) }}
          className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-slate-300 rounded-xl text-sm text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/30 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Quality Record
        </button>
      )}

      {/* Detail panel — read mode only */}
      {!isEditing && selected && <DetailPanel record={selected} />}
    </div>
  )
}
