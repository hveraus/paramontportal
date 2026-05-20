import { useState, useRef, useCallback } from 'react'
import TopBar from '../components/TopBar'
import Sidebar from '../components/Sidebar'
import Breadcrumb from '../components/Breadcrumb'
import { useRole } from '../context/RoleContext'
import { MOCK_ARCHIVES } from '../mock/archives'
import type { ArchiveFile, ArchiveFileType } from '../types'

// ── Helpers ───────────────────────────────────────────────────────────────

const ACCEPT_TYPES = ['.pdf', '.ppt', '.pptx']
const ACCEPT_MIME = [
  'application/pdf',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
]

function getFileExt(name: string): ArchiveFileType | null {
  const ext = name.split('.').pop()?.toLowerCase()
  if (ext === 'pdf')  return 'pdf'
  if (ext === 'ppt')  return 'ppt'
  if (ext === 'pptx') return 'pptx'
  return null
}

function formatBytes(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_048_576).toFixed(1)} MB`
  if (bytes >= 1_000)     return `${Math.round(bytes / 1_024)} KB`
  return `${bytes} B`
}

// ── Icons ─────────────────────────────────────────────────────────────────

function IconUpload() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  )
}

function IconSearch() {
  return (
    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
    </svg>
  )
}

function IconSort() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
    </svg>
  )
}

function IconEye() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}

function IconDownload() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  )
}

function IconTrash() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
}

function IconShare() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  )
}

function IconX() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

// ── File type icon ─────────────────────────────────────────────────────────

function FileTypeIcon({ type, size = 'lg' }: { type: ArchiveFileType; size?: 'lg' | 'sm' }) {
  const isPdf = type === 'pdf'
  const dim = size === 'lg' ? 'w-14 h-14' : 'w-8 h-8'
  const textSize = size === 'lg' ? 'text-[11px]' : 'text-[8px]'
  const bg = isPdf ? 'bg-red-500' : 'bg-orange-500'
  const label = type.toUpperCase()

  return (
    <div className={`${dim} ${bg} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
      <span className={`${textSize} font-bold text-white tracking-wide`}>{label}</span>
    </div>
  )
}

// ── Upload file row ────────────────────────────────────────────────────────

interface UploadItem {
  id: string
  file: File
  progress: number           // 0-100
  status: 'uploading' | 'done' | 'error'
  errorMsg?: string
}

function UploadFileRow({ item, onRemove }: { item: UploadItem; onRemove: (id: string) => void }) {
  const ext = getFileExt(item.file.name)
  const type: ArchiveFileType = ext ?? 'pdf'

  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
      <FileTypeIcon type={type} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">{item.file.name}</p>
        <p className="text-xs text-slate-400 mt-0.5">{formatBytes(item.file.size)}</p>

        {/* Progress bar */}
        {item.status === 'uploading' && (
          <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${item.progress}%` }}
            />
          </div>
        )}
        {item.status === 'error' && (
          <p className="text-xs text-red-500 mt-1">{item.errorMsg ?? 'Upload failed'}</p>
        )}
      </div>

      <div className="flex-shrink-0 flex items-center gap-2">
        {item.status === 'uploading' && (
          <span className="text-xs text-slate-400">{item.progress}%</span>
        )}
        {item.status === 'done' && (
          <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
            <IconCheck />
          </span>
        )}
        {item.status === 'error' && (
          <span className="text-xs text-red-500 font-medium">Failed</span>
        )}
        <button
          onClick={() => onRemove(item.id)}
          className="text-slate-300 hover:text-slate-500 transition-colors"
        >
          <IconX />
        </button>
      </div>
    </div>
  )
}

// ── Upload modal ───────────────────────────────────────────────────────────

interface UploadModalProps {
  onClose: () => void
  onSuccess: (newFiles: ArchiveFile[]) => void
}

function UploadModal({ onClose, onSuccess }: UploadModalProps) {
  const [items, setItems]   = useState<UploadItem[]>([])
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files)
    const valid = arr.filter(f => {
      const ext = getFileExt(f.name)
      return ext !== null && ACCEPT_MIME.includes(f.type) || getFileExt(f.name) !== null
    })

    const newItems: UploadItem[] = valid.map(f => ({
      id: `up-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file: f,
      progress: 0,
      status: 'uploading',
    }))

    if (newItems.length === 0) return

    setItems(prev => [...prev, ...newItems])

    // Simulate upload progress per file
    newItems.forEach(item => {
      let pct = 0
      const tick = () => {
        pct += Math.random() * 18 + 8
        if (pct >= 100) {
          pct = 100
          setItems(prev => prev.map(i => i.id === item.id ? { ...i, progress: 100, status: 'done' } : i))
        } else {
          setItems(prev => prev.map(i => i.id === item.id ? { ...i, progress: Math.round(pct) } : i))
          setTimeout(tick, 200 + Math.random() * 300)
        }
      }
      setTimeout(tick, 100)
    })
  }, [])

  // Auto-close when all done
  const allDone = items.length > 0 && items.every(i => i.status === 'done' || i.status === 'error')

  const handleConfirm = () => {
    const doneItems = items.filter(i => i.status === 'done')
    const newFiles: ArchiveFile[] = doneItems.map(item => ({
      id: `af-new-${item.id}`,
      name: item.file.name,
      type: getFileExt(item.file.name) ?? 'pdf',
      sizeBytes: item.file.size,
      sizeLabel: formatBytes(item.file.size),
      uploadedAt: new Date().toISOString().slice(0, 10),
      uploadedBy: {
        id: 'u-sarah',
        name: 'Sarah Thompson',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ST&backgroundColor=f59e0b&fontColor=ffffff',
      },
      url: URL.createObjectURL(item.file),
    }))
    onSuccess(newFiles)
    onClose()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    addFiles(e.dataTransfer.files)
  }

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">Upload Files</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <IconX />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-4 overflow-y-auto">

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-all
              ${dragOver
                ? 'border-blue-400 bg-blue-50'
                : 'border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/40'
              }`}
          >
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-700">
                {dragOver ? 'Drop files here' : 'Drag & drop files, or click to browse'}
              </p>
              <p className="text-xs text-slate-400 mt-1">Supports .pdf, .ppt, .pptx · Multiple files allowed</p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT_TYPES.join(',')}
              multiple
              className="hidden"
              onChange={e => e.target.files && addFiles(e.target.files)}
            />
          </div>

          {/* File list */}
          {items.length > 0 && (
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 px-4">
                {items.map(item => (
                  <UploadFileRow key={item.id} item={item} onRemove={removeItem} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            {items.length > 0
              ? `${items.filter(i => i.status === 'done').length} / ${items.length} files ready`
              : 'No files selected'}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!allDone || items.every(i => i.status === 'error')}
              className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors
                ${allDone && !items.every(i => i.status === 'error')
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
            >
              Add to Library
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Preview mock data ─────────────────────────────────────────────────────

interface MockSlide {
  title: string
  bullets: string[]
  accent: string   // tailwind bg colour class
}

interface MockPage {
  heading: string
  body: string[]
}

interface MockPreviewData {
  type: 'slides' | 'document'
  title: string
  slides?: MockSlide[]
  pages?: MockPage[]
}

const PREVIEW_DATA: Record<string, MockPreviewData> = {
  'af-001': {
    type: 'document',
    title: 'Q3 2025 Product Catalogue',
    pages: [
      { heading: 'Introduction', body: ['This catalogue presents our full range of Arts & Crafts, Stationery, and Seasonal products available for Q3 2025.', 'All items listed are compliant with ASTM F963 and EN71 safety standards. FOB pricing is based on Ningbo port with a minimum 60-day lead time.'] },
      { heading: 'Crafts — Yarn & Fibre', body: ['SKU range: PM-YN-001 – PM-YN-048. Available in 24 colourways. Inner pack: 6 units. Master carton: 72 units.', 'New for Q3: Chunky Merino Blend (PM-YN-041) and Neon Craft Pack (PM-YN-044). Both items carry CE and ASTM certifications.'] },
      { heading: 'Art Supplies — Paints', body: ['Watercolour sets, acrylic sets, and mixed-media kits. All paints are AP-certified non-toxic.', 'Flagship line: 48-colour Studio Acrylic Set (PM-AP-112). FOB $4.85. MOQ 500 sets.'] },
      { heading: 'Stationery — Notebooks', body: ['Ruled, dotted, and blank notebooks available in A5 and A4 formats. Covers: kraft, linen, and PU leather.', 'Best seller: Linen Hardcover A5 Ruled (PM-NB-023). Reorder rate 78% across all accounts in Q1–Q2 2025.'] },
    ],
  },
  'af-002': {
    type: 'slides',
    title: 'Walmart Holiday 2025 Presentation',
    slides: [
      { title: 'Holiday 2025 — Product Proposal', bullets: ['Paramont Trading Co. · Ningbo', 'Prepared for Walmart Seasonal Buying Team', 'April 2025'], accent: 'bg-blue-600' },
      { title: 'Market Opportunity', bullets: ['Holiday crafts category grew +14% YoY in 2024', 'Walmart holiday crafts ranked #3 category by unit volume', 'Under-penetrated: premium yarn & paint sets < 8% shelf share'], accent: 'bg-indigo-600' },
      { title: 'Proposed Assortment', bullets: ['12 hero SKUs across Yarn, Painting, and Seasonal Décor', 'Price points: $4.97 – $19.97', 'All items ASTM F963 certified; 6 carry additional CPSC compliance'], accent: 'bg-violet-600' },
      { title: 'Logistics & Pricing', bullets: ['FOB Ningbo · Lead time 75 days', 'Full-pallet program available for DC direct', 'Proposed IMU: 58–63% at suggested retail'], accent: 'bg-purple-600' },
      { title: 'Next Steps', bullets: ['Sample review by May 15', 'Final selection confirmed June 1', 'First PO cut-off: June 30 for on-shelf Oct 1'], accent: 'bg-pink-600' },
    ],
  },
  'af-003': {
    type: 'slides',
    title: 'Dollar Tree Q2 Proposal',
    slides: [
      { title: 'Dollar Tree Q2 2025 — $1.25 Value Programme', bullets: ['Paramont Trading Co.', 'Submitted: March 2025'], accent: 'bg-green-600' },
      { title: 'Programme Overview', bullets: ['18 SKUs at $1.25 retail', 'Categories: Stationery, Basic Craft, Seasonal', 'All items comply with Dollar Tree vendor packaging standards'], accent: 'bg-emerald-600' },
      { title: 'Top 5 Hero SKUs', bullets: ['Mini Watercolour Set 8-pan (PM-WC-08)', '3-pack Glitter Glue Pens (PM-GG-03)', 'A6 Kraft Notebook (PM-NB-A6)', 'Jumbo Foam Brush Set 5pc (PM-FB-05)', 'Easter Foam Sticker Sheet 2pk (PM-ST-EA)'], accent: 'bg-teal-600' },
      { title: 'Delivery Schedule', bullets: ['Q2 Inline: Feb 28 PO', 'Q2 Seasonal: Mar 15 PO', 'Replenishment windows: rolling 4-week'], accent: 'bg-cyan-600' },
    ],
  },
  'af-004': {
    type: 'document',
    title: 'Five Below Summer Collection Brief',
    pages: [
      { heading: 'Brief Overview', body: ['This brief outlines the Summer 2025 product strategy for the Five Below channel, focusing on craft kits, outdoor activity sets, and back-to-school stationery.', 'Target price range: $5 – $10. All items must achieve ≥ 50% IMU at standard FOB.'] },
      { heading: 'Craft Kits', body: ['Recommended: tie-dye kits, friendship bracelet sets, and sand art kits. Competitive retail price: $5.00.', 'Key packaging requirement: hang-sell ready, PDQ display available for 24-unit floor displays.'] },
      { heading: 'Back-to-School Stationery', body: ['Gel pen sets (12-colour, 24-colour), highlighter packs, and hardcover journals.', 'Planogram slot: 4 linear feet in seasonal aisle. Fixture reset date: July 14.'] },
    ],
  },
  'af-005': {
    type: 'slides',
    title: 'Crafts Category Overview 2025',
    slides: [
      { title: 'Crafts Category — Full Year 2025', bullets: ['Strategic Review & Roadmap', 'Paramont Product Management · March 2025'], accent: 'bg-orange-500' },
      { title: 'Category Performance 2024', bullets: ['Total category revenue: $12.4M (+9% YoY)', 'Top sub-category: Yarn & Fibre (31% share)', 'Fastest growing: Mixed Media Kits (+28%)'], accent: 'bg-amber-500' },
      { title: 'Assortment Gaps Identified', bullets: ['Premium adult colouring (no current offering)', 'Resin & jewellery-making kits (competitor SKU count +3× ours)', 'Eco/sustainable materials line (retailer demand increasing)'], accent: 'bg-yellow-500' },
      { title: '2025 New Launches', bullets: ['Q1: Resin Starter Kit (PM-RS-001 – 004)', 'Q2: Eco Craft Series 12 SKUs', 'Q3: Holiday Specialty Kits 8 SKUs', 'Q4: Premium Adult Colouring 6 SKUs'], accent: 'bg-lime-600' },
      { title: 'Key Retailer Priorities', bullets: ['Walmart: value bundles, $9.97 price point', 'Target: premium positioning, $14.99–$24.99', 'Amazon: multipack / subscription-friendly packaging'], accent: 'bg-green-600' },
    ],
  },
  'af-006': {
    type: 'document',
    title: 'Compliance & Certifications Summary',
    pages: [
      { heading: 'Scope', body: ['This document summarises current third-party test certifications held for all active Paramont SKUs as of February 2025.', 'Certificates are maintained with SGS Ningbo and Intertek Zhuhai. Full test reports available on request.'] },
      { heading: 'ASTM F963 (US)', body: ['Coverage: 100% of SKUs sold into US retail channels.', 'Last full audit: October 2024. Next scheduled: October 2025. No open non-conformances.'] },
      { heading: 'EN71 (EU/UK)', body: ['Coverage: all SKUs in the EU & UK assortment (47 active items).', 'Parts 1, 2, and 3 certified. Part 9 (organic chemical compounds) certified for all paint and ink SKUs.'] },
      { heading: 'REACH & Prop 65', body: ['All formulated products (paints, glues, inks) have current SDS on file.', 'Prop 65 compliance confirmed for California retail accounts. Last updated: January 2025.'] },
    ],
  },
}

function getMockPreview(file: ArchiveFile): MockPreviewData {
  if (PREVIEW_DATA[file.id]) return PREVIEW_DATA[file.id]
  // Fallback generic content
  if (file.type === 'pdf') {
    return {
      type: 'document',
      title: file.name.replace(/\.[^.]+$/, ''),
      pages: [
        { heading: 'Executive Summary', body: ['This document provides an overview of key findings, recommendations, and supporting data compiled by the Paramont product team.', 'Please refer to the appendix for full data tables and certification references.'] },
        { heading: 'Key Findings', body: ['Market analysis indicates strong growth potential across core categories for the upcoming season.', 'Supplier consolidation opportunities exist in the stationery and art supplies segments.'] },
        { heading: 'Recommendations', body: ['Prioritise Q3 investment in high-velocity craft kit SKUs based on sell-through data from 2024.', 'Review MOQ thresholds with Tier 1 suppliers to improve margin on mid-range price points.'] },
      ],
    }
  }
  return {
    type: 'slides',
    title: file.name.replace(/\.[^.]+$/, ''),
    slides: [
      { title: file.name.replace(/\.[^.]+$/, ''), bullets: ['Paramont Trading Co.', new Date(file.uploadedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })], accent: 'bg-blue-600' },
      { title: 'Overview', bullets: ['Category strategy and product recommendations', 'Pricing and logistics summary', 'Next steps and timeline'], accent: 'bg-indigo-600' },
      { title: 'Proposed Assortment', bullets: ['Core SKUs selected based on velocity and margin targets', 'All items certified per retailer compliance requirements', 'FOB Ningbo pricing included in appendix'], accent: 'bg-violet-600' },
      { title: 'Next Steps', bullets: ['Sample review and approval', 'PO confirmation and production schedule', 'Delivery and compliance sign-off'], accent: 'bg-purple-600' },
    ],
  }
}

// ── Preview modal ─────────────────────────────────────────────────────────

function PreviewModal({ file, onClose }: { file: ArchiveFile; onClose: () => void }) {
  const data = getMockPreview(file)
  const [activeSlide, setActiveSlide] = useState(0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col w-full max-w-4xl max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <FileTypeIcon type={file.type} size="sm" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{file.name}</p>
              <p className="text-xs text-slate-400">{file.sizeLabel} · Uploaded {file.uploadedAt}</p>
            </div>
          </div>
          <button onClick={onClose} className="ml-4 flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors">
            <IconX />
          </button>
        </div>

        {/* Body */}
        {data.type === 'slides' && data.slides ? (
          <div className="flex flex-1 min-h-0">
            {/* Slide thumbnails */}
            <div className="w-36 flex-shrink-0 border-r border-slate-100 overflow-y-auto bg-slate-50 py-3 px-2 space-y-2">
              {data.slides.map((slide, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`w-full rounded-lg overflow-hidden border-2 transition-all text-left
                    ${activeSlide === i ? 'border-blue-500 shadow-md' : 'border-transparent hover:border-slate-300'}`}
                >
                  <div className={`${slide.accent} px-2 py-3 aspect-video flex flex-col justify-center gap-1`}>
                    <p className="text-white text-[7px] font-semibold leading-tight line-clamp-2">{slide.title}</p>
                    {slide.bullets.slice(0, 2).map((b, j) => (
                      <p key={j} className="text-white/70 text-[5px] leading-tight truncate">• {b}</p>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 text-center py-1">{i + 1}</p>
                </button>
              ))}
            </div>

            {/* Main slide */}
            <div className="flex-1 overflow-y-auto flex items-center justify-center p-8 bg-slate-100">
              {data.slides[activeSlide] && (() => {
                const slide = data.slides![activeSlide]
                return (
                  <div className={`${slide.accent} rounded-2xl shadow-xl w-full max-w-2xl aspect-video flex flex-col justify-center px-14 py-10 gap-5`}>
                    <h2 className="text-2xl font-bold text-white leading-snug">{slide.title}</h2>
                    <ul className="space-y-2.5">
                      {slide.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-white/90 text-sm">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })()}
            </div>
          </div>
        ) : (
          /* Document pages */
          <div className="flex-1 overflow-y-auto p-8 bg-slate-100">
            <div className="max-w-2xl mx-auto space-y-6">
              {data.pages?.map((pg, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 px-8 py-6">
                  {i === 0 && (
                    <h1 className="text-xl font-bold text-slate-900 mb-4 pb-4 border-b border-slate-100">{data.title}</h1>
                  )}
                  <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">{pg.heading}</h3>
                  {pg.body.map((para, j) => (
                    <p key={j} className="text-sm text-slate-600 leading-relaxed mb-2">{para}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        {data.type === 'slides' && data.slides && (
          <div className="flex items-center justify-center gap-4 px-6 py-3 border-t border-slate-100 flex-shrink-0">
            <button
              onClick={() => setActiveSlide(p => Math.max(0, p - 1))}
              disabled={activeSlide === 0}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600
                hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>
            <span className="text-xs text-slate-400">
              {activeSlide + 1} / {data.slides.length}
            </span>
            <button
              onClick={() => setActiveSlide(p => Math.min(data.slides!.length - 1, p + 1))}
              disabled={activeSlide === data.slides.length - 1}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600
                hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Share modal ───────────────────────────────────────────────────────────

function mockShareData(fileId: string) {
  const hash = fileId.replace(/[^a-z0-9]/gi, '').slice(-6).padStart(6, '0')
  return {
    link: `https://share.paramontportal.com/f/${hash}`,
    password: `PM-${hash.toUpperCase()}`,
  }
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text).catch(() => {})
        setCopied(true)
        setTimeout(() => setCopied(false), 1800)
      }}
      className="flex-shrink-0 px-3 py-1.5 text-xs rounded-lg border border-slate-200
        text-slate-500 hover:bg-slate-50 transition-colors min-w-[64px]"
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

function ShareModal({ file, onClose }: { file: ArchiveFile; onClose: () => void }) {
  const share = mockShareData(file.id)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-[420px] mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Share file</h3>
            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[320px]">{file.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors mt-0.5"
          >
            <IconX />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Share link</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                <p className="text-sm text-slate-700 truncate font-mono">{share.link}</p>
              </div>
              <CopyButton text={share.link} />
            </div>
          </div>

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
  )
}

// ── Delete confirm dialog ──────────────────────────────────────────────────

function DeleteConfirmDialog({
  file,
  onConfirm,
  onCancel,
}: {
  file: ArchiveFile
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Delete file?</h3>
            <p className="text-sm text-slate-500 mt-1">
              <span className="font-medium text-slate-700">{file.name}</span> will be permanently removed.
              This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ── File row (table) ──────────────────────────────────────────────────────

function FileRow({
  file,
  canDelete,
  onDelete,
}: {
  file: ArchiveFile
  canDelete: boolean
  onDelete: (id: string) => void
}) {
  const [showDelete, setShowDelete]   = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showShare, setShowShare]     = useState(false)

  return (
    <>
      <tr className="hover:bg-slate-50/70 transition-colors">
        {/* Name + type icon */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <FileTypeIcon type={file.type} size="sm" />
            <span
              className="text-sm font-medium text-slate-800 truncate"
              title={file.name}
            >
              {file.name}
            </span>
          </div>
        </td>

        {/* Uploader */}
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="flex items-center gap-2">
            <img
              src={file.uploadedBy.avatar}
              alt={file.uploadedBy.name}
              className="w-6 h-6 rounded-full flex-shrink-0"
            />
            <span className="text-sm text-slate-600">{file.uploadedBy.name}</span>
          </div>
        </td>

        {/* Date */}
        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
          {file.uploadedAt}
        </td>

        {/* Size */}
        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500 text-right">
          {file.sizeLabel}
        </td>

        {/* Actions — visible on row hover */}
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="flex items-center gap-1 justify-end">
            <button
              onClick={() => setShowPreview(true)}
              title="Preview"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
                text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <IconEye />
              Preview
            </button>
            <button
              onClick={() => setShowShare(true)}
              title="Share"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
                text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <IconShare />
              Share
            </button>
            <button
              onClick={() => {
                const a = document.createElement('a')
                a.href = file.url
                a.download = file.name
                a.click()
              }}
              title="Download"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
                text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <IconDownload />
              Download
            </button>
            {canDelete && (
              <button
                onClick={() => setShowDelete(true)}
                title="Delete"
                className="inline-flex items-center justify-center w-7 h-7 rounded-lg
                  text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <IconTrash />
              </button>
            )}
          </div>
        </td>
      </tr>

      {showPreview && (
        <PreviewModal file={file} onClose={() => setShowPreview(false)} />
      )}
      {showShare && (
        <ShareModal file={file} onClose={() => setShowShare(false)} />
      )}
      {showDelete && (
        <DeleteConfirmDialog
          file={file}
          onConfirm={() => { onDelete(file.id); setShowDelete(false) }}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </>
  )
}

// ── Sort options ──────────────────────────────────────────────────────────

type SortKey = 'date-desc' | 'date-asc' | 'name-asc' | 'size-desc'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'date-desc', label: 'Newest first' },
  { key: 'date-asc',  label: 'Oldest first' },
  { key: 'name-asc',  label: 'Name A–Z' },
  { key: 'size-desc', label: 'Largest first' },
]

function sortFiles(files: ArchiveFile[], key: SortKey): ArchiveFile[] {
  return [...files].sort((a, b) => {
    if (key === 'date-desc') return b.uploadedAt.localeCompare(a.uploadedAt)
    if (key === 'date-asc')  return a.uploadedAt.localeCompare(b.uploadedAt)
    if (key === 'name-asc')  return a.name.localeCompare(b.name)
    if (key === 'size-desc') return b.sizeBytes - a.sizeBytes
    return 0
  })
}

// ── Sort dropdown ─────────────────────────────────────────────────────────

function SortDropdown({ value, onChange }: { value: SortKey; onChange: (k: SortKey) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = SORT_OPTIONS.find(o => o.key === value)!

  // Close on outside click
  const handleBlur = useCallback((e: React.FocusEvent) => {
    if (!ref.current?.contains(e.relatedTarget as Node)) setOpen(false)
  }, [])

  return (
    <div className="relative" ref={ref} onBlur={handleBlur}>
      <button
        onClick={() => setOpen(p => !p)}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-slate-200
          bg-white text-slate-600 hover:bg-slate-50 transition-colors"
      >
        <IconSort />
        {current.label}
        <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1.5 w-40 bg-white border border-slate-200
          rounded-xl shadow-lg py-1.5 z-20">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.key}
              onClick={() => { onChange(opt.key); setOpen(false) }}
              className={`w-full text-left px-3.5 py-2 text-sm transition-colors
                ${opt.key === value
                  ? 'text-blue-600 font-medium bg-blue-50'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────

export default function ArchivesPage() {
  const { role } = useRole()
  const canDelete = role === 'admin' || role === 'product_manager'

  const [files, setFiles]         = useState<ArchiveFile[]>(MOCK_ARCHIVES)
  const [search, setSearch]       = useState('')
  const [sort, setSort]           = useState<SortKey>('date-desc')
  const [showUpload, setShowUpload] = useState(false)

  const handleUploadSuccess = (newFiles: ArchiveFile[]) => {
    setFiles(prev => [...newFiles, ...prev])
  }

  const handleDelete = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const filtered = sortFiles(
    files.filter(f =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.uploadedBy.name.toLowerCase().includes(search.toLowerCase())
    ),
    sort,
  )

  return (
    <div className="min-h-screen bg-slate-100">
      <TopBar />

      <div className="flex">
        <Sidebar topOffset={56} />

        <div className="flex-1 min-w-0 px-6 py-5 space-y-4">

          {/* Breadcrumb */}
          <Breadcrumb crumbs={[
            { label: 'Home', href: '#' },
            { label: 'Products', href: '#' },
            { label: 'Archives' },
          ]} />

          {/* Page header */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Archives</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {files.length} file{files.length !== 1 ? 's' : ''} · PDFs and presentations
              </p>
            </div>

            <button
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg
                bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              <IconUpload />
              Upload File
            </button>
          </div>

          {/* Toolbar: search + sort */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48 max-w-sm">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <IconSearch />
              </span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search files or uploader…"
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-white
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  placeholder:text-slate-400"
              />
            </div>
            <SortDropdown value={sort} onChange={setSort} />
          </div>

          {/* File table */}
          {filtered.length > 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      File name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">
                      Uploaded by
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">
                      Date
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">
                      Size
                    </th>
                    <th className="px-4 py-3 w-48" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map(file => (
                    <FileRow
                      key={file.id}
                      file={file}
                      canDelete={canDelete}
                      onDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <svg className="w-12 h-12 mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm">
                {search ? `No files match "${search}"` : 'No files uploaded yet'}
              </p>
              {!search && (
                <button
                  onClick={() => setShowUpload(true)}
                  className="mt-3 text-sm text-blue-600 hover:underline font-medium"
                >
                  Upload the first file
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Upload modal */}
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  )
}
