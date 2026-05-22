import { useState, useRef, useEffect, useMemo } from 'react'
import { mockProduct } from './mock/productDetail'
import { SAMPLE_SLOTS } from './mock/sampleRoom'
import { useRole } from './context/RoleContext'
import type { ProductDetail } from './types'
import Breadcrumb from './components/Breadcrumb'
import { useNavigation } from './context/NavigationContext'
import ImageGallery from './components/ImageGallery'
import StatusTag from './components/StatusTag'
import BasicInfoTab from './components/tabs/BasicInfoTab'
import SpecsTab from './components/tabs/SpecsTab'
import PackagingTab from './components/tabs/PackagingTab'
import QualityTab from './components/tabs/QualityTab'
import CostTab from './components/tabs/CostTab'
import CustomsTab from './components/tabs/CustomsTab'
import PatentsTab from './components/tabs/PatentsTab'

import CommittedTab from './components/tabs/CommittedTab'
import SourceFilesTab from './components/tabs/SourceFilesTab'
import ActivityPanel from './components/ActivityPanel'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'

type TabId = 'basic' | 'specs' | 'packaging' | 'quality' | 'cost' | 'customs' | 'patents' | 'committed' | 'source'

const TABS: { id: TabId; label: string; costOnly?: boolean; patentOnly?: boolean }[] = [
  { id: 'basic',           label: 'Basic Info' },
  { id: 'specs',           label: 'Specifications' },
  { id: 'packaging',       label: 'Packaging' },
  { id: 'quality',         label: 'Quality' },
  { id: 'cost',            label: 'Costings',       costOnly: true },
  { id: 'customs',         label: 'Customs' },

  { id: 'patents',         label: 'Patents',        patentOnly: true },
  { id: 'committed',       label: 'Program' },
  { id: 'source',          label: 'Art Works' },
]

const STATUS_VARIANT: Record<string, 'blue' | 'green' | 'red' | 'purple' | 'yellow' | 'orange' | 'gray'> = {
  'Concept':        'blue',
  'Proposed':       'purple',
  'Pre-selected':   'yellow',
  'Initial Sampled':'orange',
  'Production':     'green',
  'Dropped':        'gray',
}

const ALL_STATUSES = ['Concept', 'Proposed', 'Pre-selected', 'Initial Sampled', 'Production', 'Dropped'] as const

function deepClone<T>(val: T): T {
  return JSON.parse(JSON.stringify(val)) as T
}

// ── Export dropdown ────────────────────────────────────────────────────────

function ExportDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const options = [
    { label: 'Export as PDF',   icon: '📄' },
    { label: 'Export as Excel', icon: '📊' },
    { label: 'Export as CSV',   icon: '📋' },
  ]

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(p => !p)}
        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border
          border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export
        <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-slate-200
          rounded-xl shadow-lg py-1.5 z-50">
          {options.map(opt => (
            <button
              key={opt.label}
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-600
                hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
            >
              <span className="text-base leading-none">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Favorite button ────────────────────────────────────────────────────────

function FavoriteButton() {
  const [active, setActive] = useState(false)
  return (
    <button
      onClick={() => setActive(p => !p)}
      title={active ? 'Remove from favorites' : 'Add to favorites'}
      className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border transition-all
        ${active
          ? 'bg-rose-50 border-rose-300 text-rose-600 hover:bg-rose-100'
          : 'bg-white border-slate-200 text-slate-500 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-500'
        }`}
    >
      <svg
        className={`w-4 h-4 transition-all ${active ? 'scale-110' : ''}`}
        viewBox="0 0 24 24"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={active ? 0 : 1.8}
      >
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      {active ? 'Favorited' : 'Favorite'}
    </button>
  )
}

// ── Add to Proposal button ────────────────────────────────────────────────

function AddToProposalButton() {
  const [added, setAdded] = useState(false)
  return (
    <button
      onClick={() => setAdded(p => !p)}
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-sm rounded-lg border font-medium transition-all
        ${added
          ? 'bg-violet-600 border-violet-600 text-white hover:bg-violet-700'
          : 'bg-white border-violet-300 text-violet-700 hover:bg-violet-50 hover:border-violet-400'
        }`}
    >
      {added ? (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Added to Proposal
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Add to Proposal
        </>
      )}
    </button>
  )
}

// ── Sample Room assign modal ───────────────────────────────────────────────

interface SampleLocation { room: string; shelf: string; position: string }

function SampleAssignModal({
  current,
  onAssign,
  onClose,
}: {
  current: SampleLocation | null
  onAssign: (loc: SampleLocation) => void
  onClose: () => void
}) {
  const rooms = useMemo(() => [...new Set(SAMPLE_SLOTS.map(s => s.room))].sort(), [])

  const [room,     setRoom]     = useState(current?.room     ?? '')
  const [shelf,    setShelf]    = useState(current?.shelf    ?? '')
  const [position, setPosition] = useState(current?.position ?? '')
  const [slotId,   setSlotId]   = useState('')

  const shelves = useMemo(() =>
    room ? [...new Set(SAMPLE_SLOTS.filter(s => s.room === room).map(s => s.shelf))].sort() : [],
  [room])

  const selectStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat' as const,
    backgroundPosition: 'right 10px center',
    backgroundSize: '14px',
  }

  // slotId is used internally for future slot tracking
  void slotId

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <h2 className="text-sm font-semibold text-slate-900">Assign to Sample Room</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Room */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Room</label>
            <select
              value={room}
              onChange={e => { setRoom(e.target.value); setShelf(''); setSlotId('') }}
              className="w-full h-10 pl-3 pr-9 text-sm rounded-lg border border-slate-200 bg-white
                text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none"
              style={selectStyle}
            >
              <option value="">Select room…</option>
              {rooms.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Shelf */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Shelf</label>
            <select
              value={shelf}
              onChange={e => { setShelf(e.target.value); setSlotId('') }}
              disabled={!room}
              className="w-full h-10 pl-3 pr-9 text-sm rounded-lg border border-slate-200 bg-white
                text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none
                disabled:opacity-40 disabled:cursor-not-allowed"
              style={selectStyle}
            >
              <option value="">Select shelf…</option>
              {shelves.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Position */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Position</label>
            <input
              type="text"
              value={position}
              onChange={e => setPosition(e.target.value)}
              disabled={!shelf}
              placeholder="e.g. A-02-03"
              className="w-full h-10 px-3 text-sm rounded-lg border border-slate-200 bg-white
                text-slate-700 placeholder:text-slate-400 font-mono
                focus:outline-none focus:ring-2 focus:ring-violet-500
                disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-slate-50"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-3">
          {current && (
            <button
              onClick={() => { onAssign({ room: '', shelf: '', position: '' }); onClose() }}
              className="text-xs text-slate-400 hover:text-red-500 transition-colors"
            >
              Remove location
            </button>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => room && shelf && position.trim() && onAssign({ room, shelf, position: position.trim() })}
              disabled={!room || !shelf || !position.trim()}
              className="px-4 py-2 text-sm rounded-lg bg-violet-600 text-white font-medium
                hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const { can } = useRole()
  const { navigate } = useNavigation()
  const [activeTab, setActiveTab]       = useState<TabId>('basic')
  const [sampleLoc, setSampleLoc]   = useState<SampleLocation | null>(null)
  const [showAssign, setShowAssign] = useState(false)

  const [product, setProduct]       = useState<ProductDetail>(() => deepClone(mockProduct))
  const [editingTab, setEditingTab] = useState<TabId | null>(null)
  const [draft, setDraft]           = useState<ProductDetail>(() => deepClone(mockProduct))
  const [pendingTab, setPendingTab] = useState<TabId | null>(null)
  const [statusOpen, setStatusOpen] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<string | null>(null)
  const statusRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!statusOpen) return
    const handler = (e: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) setStatusOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [statusOpen])

  const startEdit = (tab: TabId) => { setDraft(deepClone(product)); setEditingTab(tab) }
  const cancelEdit = () => setEditingTab(null)
  const saveEdit = () => { setProduct(deepClone(draft)); setEditingTab(null) }
  const onChange = (fields: Partial<ProductDetail>) =>
    setDraft(prev => ({ ...prev, ...fields }))

  const visibleTabs = TABS.filter((t) =>
    (!t.costOnly || can('view_cost')) && (!t.patentOnly || can('view_patents'))
  )
  const resolvedTab = visibleTabs.find((t) => t.id === activeTab)
    ? activeTab
    : (visibleTabs[0]?.id ?? 'basic')


  return (
    <div className="min-h-screen bg-slate-100">
      <TopBar />

      {/* Page body: sidebar + content */}
      <div className="flex">
        <Sidebar topOffset={56} />

        <div className="flex-1 min-w-0 px-6 py-5 space-y-4">
        {/* Back button */}
        <button
          onClick={() => navigate('products')}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors group"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </button>

        {/* Breadcrumb */}
        <Breadcrumb crumbs={[
          { label: 'Home', href: '#' },
          { label: product.categoryPath[0], href: '#' },
          { label: product.productName },
        ]} />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900 leading-tight">
              {product.productName}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-mono text-slate-400">{product.itemNo}</span>
              <span className="text-slate-200">·</span>
              {/* Status — clickable dropdown */}
              <div ref={statusRef} className="relative">
                <button
                  onClick={() => setStatusOpen(o => !o)}
                  title="Change status"
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1
                    rounded-full border transition-colors hover:brightness-95
                    ${STATUS_VARIANT[product.status]
                      ? {
                          blue:   'bg-blue-100 text-blue-700 border-blue-200',
                          purple: 'bg-violet-100 text-violet-700 border-violet-200',
                          yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
                          orange: 'bg-orange-100 text-orange-700 border-orange-200',
                          green:  'bg-emerald-100 text-emerald-700 border-emerald-200',
                          gray:   'bg-slate-100 text-slate-600 border-slate-200',
                          red:    'bg-red-100 text-red-700 border-red-200',
                        }[STATUS_VARIANT[product.status]]
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                  {product.status}
                  <svg className="w-3 h-3 opacity-60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {statusOpen && (
                  <div className="absolute left-0 top-full mt-1.5 z-50 bg-white border border-slate-200 rounded-xl shadow-lg py-1 min-w-[220px]">
                    {ALL_STATUSES.map(s => {
                      const v = STATUS_VARIANT[s] ?? 'gray'
                      const isActive = product.status === s
                      return (
                        <button
                          key={s}
                          onClick={() => { if (!isActive) { setPendingStatus(s); setStatusOpen(false) } }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors
                            ${isActive ? 'bg-slate-50 cursor-default' : 'hover:bg-slate-50'}`}
                        >
                          <StatusTag label={s} variant={v} />
                          {isActive && (
                            <svg className="w-3.5 h-3.5 text-blue-500 ml-auto flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Status change confirmation dialog */}
              {pendingStatus && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={() => setPendingStatus(null)} />
                  <div className="relative bg-white rounded-2xl shadow-xl p-6 w-[360px] mx-4">
                    <h3 className="text-base font-semibold text-slate-900 mb-1">Change status?</h3>
                    <p className="text-sm text-slate-500 mb-5">
                      Update this product from{' '}
                      <StatusTag label={product.status} variant={STATUS_VARIANT[product.status] ?? 'gray'} />{' '}
                      to{' '}
                      <StatusTag label={pendingStatus} variant={STATUS_VARIANT[pendingStatus] ?? 'gray'} />
                    </p>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setPendingStatus(null)}
                        className="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setProduct(p => ({ ...p, status: pendingStatus as ProductDetail['status'] }))
                          setPendingStatus(null)
                        }}
                        className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <span className="text-slate-200">·</span>

              {/* Sample Room location — inline with status */}
              {sampleLoc ? (
                <span className="inline-flex items-center gap-2 text-xs bg-violet-50 text-violet-700
                  border border-violet-200 rounded-full pl-2.5 pr-1.5 py-1">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  <span>{sampleLoc.room}</span>
                  <span className="text-violet-300">·</span>
                  <span>{sampleLoc.shelf}</span>
                  <span className="text-violet-300">·</span>
                  <span className="font-mono font-semibold">{sampleLoc.position}</span>
                  <button onClick={() => setShowAssign(true)} title="Edit location"
                    className="ml-0.5 p-0.5 rounded-full hover:bg-violet-100 transition-colors">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button onClick={() => setSampleLoc(null)} title="Remove location"
                    className="p-0.5 rounded-full hover:bg-red-100 hover:text-red-500 transition-colors">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ) : (
                <button onClick={() => setShowAssign(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 border border-dashed
                    border-slate-300 hover:border-violet-400 hover:text-violet-600 rounded-full px-3 py-1 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  Assign to Sample Room
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <ExportDropdown />
            <FavoriteButton />
            <AddToProposalButton />
          </div>
        </div>

        {/* 40 / 60 split */}
        <div className="flex gap-5 items-start">

          {/* Image panel */}
          <div className="w-[40%] flex-shrink-0 sticky top-[52px]">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
              <ImageGallery images={product.images} />
            </div>
          </div>

          {/* Info tabs */}
          <div className="flex-1 min-w-0">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              {/* Tab bar */}
              <div className="flex border-b border-slate-100 overflow-x-auto scrollbar-thin">
                {visibleTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (editingTab !== null && editingTab !== tab.id) {
                        setPendingTab(tab.id)
                      } else {
                        setActiveTab(tab.id)
                      }
                    }}
                    className={`flex-shrink-0 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                      ${resolvedTab === tab.id
                        ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div>
                {/* Action bar */}
                <div className={`flex items-center justify-end px-5 py-2 border-b ${
                    editingTab === resolvedTab
                      ? 'bg-blue-50 border-blue-100'
                      : 'bg-slate-50 border-slate-100'
                  }`}>
                    {/* Left: contextual info + editing label */}
                    <div className="mr-auto flex items-center gap-3">
                      {/* Cost: confidential warning */}
                      {resolvedTab === 'cost' && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-amber-600">
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          Cost data is confidential. Do not share externally.
                        </span>
                      )}
                      {/* Patents: summary counts */}
                      {resolvedTab === 'patents' && (() => {
                        const pts = editingTab === 'patents' ? draft.patents : product.patents
                        if (pts.length === 0) return null
                        const counts = { Granted: 0, Pending: 0, Expired: 0 }
                        pts.forEach(p => { if (p.status) counts[p.status as keyof typeof counts]++ })
                        return (
                          <span className="flex items-center gap-3">
                            <span className="text-xs text-slate-400">{pts.length} patent{pts.length !== 1 ? 's' : ''}</span>
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
                          </span>
                        )
                      })()}
                      {editingTab === resolvedTab && (
                        <span className="text-xs text-blue-600 font-medium">Editing…</span>
                      )}
                    </div>

                    {/* Program tab: CRM tip (no edit button) */}
                    {resolvedTab === 'committed' && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 mr-auto truncate py-1 border border-transparent">
                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Customer names are sourced from the external CRM system. Pending entries will update automatically when data is available.
                      </span>
                    )}

                    {/* Source Files tab: Upload button */}
                    {resolvedTab === 'source' && (
                      <>
                        <input
                          type="file"
                          id="source-file-upload"
                          className="hidden"
                          accept=".ai,.psd,.pdf,.eps,.svg,.zip"
                          multiple
                          onChange={e => {
                            // Mock: just clear the input for now
                            if (e.target) e.target.value = ''
                          }}
                        />
                        <label
                          htmlFor="source-file-upload"
                          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-md
                            bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          Upload
                        </label>
                      </>
                    )}

                    {/* Other tabs: Edit / Save / Cancel */}
                    {resolvedTab !== 'committed' && resolvedTab !== 'source' && (
                      <div className="flex items-center gap-2">
                        {editingTab === resolvedTab ? (
                          <>
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-1 text-xs rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={saveEdit}
                              className="px-3 py-1 text-xs rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                            >
                              Save changes
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => startEdit(resolvedTab)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Edit
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                {/* Unsaved changes guard */}
                {pendingTab !== null && (
                  <div className="flex items-center justify-between gap-3 px-5 py-3 bg-amber-50 border-b border-amber-200">
                    <p className="text-sm text-amber-800">You have unsaved changes. Discard and switch tabs?</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPendingTab(null)}
                        className="px-3 py-1.5 text-xs rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-100 transition-colors"
                      >
                        Stay
                      </button>
                      <button
                        onClick={() => { cancelEdit(); setActiveTab(pendingTab); setPendingTab(null) }}
                        className="px-3 py-1.5 text-xs rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors"
                      >
                        Discard &amp; Switch
                      </button>
                    </div>
                  </div>
                )}

                <div className="px-6 pt-3 pb-6">
                  {resolvedTab === 'basic'     && <BasicInfoTab   product={editingTab === 'basic' ? draft : product}     isEditing={editingTab === 'basic'}     onChange={onChange} />}
                  {resolvedTab === 'specs'     && <SpecsTab       product={editingTab === 'specs' ? draft : product}     isEditing={editingTab === 'specs'}     onChange={onChange} />}
                  {resolvedTab === 'packaging' && <PackagingTab   product={editingTab === 'packaging' ? draft : product} isEditing={editingTab === 'packaging'} onChange={onChange} />}
                  {resolvedTab === 'quality'   && <QualityTab     qualityRecords={editingTab === 'quality' ? draft.qualityRecords : product.qualityRecords} isEditing={editingTab === 'quality'} onChange={onChange} />}
                  {resolvedTab === 'cost'      && <CostTab        product={editingTab === 'cost' ? draft : product}     isEditing={editingTab === 'cost'}     onChange={onChange} />}
                  {resolvedTab === 'customs'   && <CustomsTab     product={editingTab === 'customs' ? draft : product}  isEditing={editingTab === 'customs'}  onChange={onChange} />}
{resolvedTab === 'patents'        && <PatentsTab        patents={editingTab === 'patents' ? draft.patents : product.patents} isEditing={editingTab === 'patents'} onChange={onChange} />}
                  {resolvedTab === 'committed'      && <CommittedTab      committedRecords={product.committedRecords} />}
                  {resolvedTab === 'source'         && <SourceFilesTab    sourceFiles={product.sourceFiles} />}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments + Change History */}
        <ActivityPanel
          comments={product.comments}
          records={product.iterationRecords}
          pdComments={product.pdComments}
          nbPdComments={product.nbPdComments}
        />

        <div className="h-8" />
        </div> {/* end content column */}
      </div> {/* end flex row */}

      {/* Sample Room assign modal */}
      {showAssign && (
        <SampleAssignModal
          current={sampleLoc}
          onAssign={loc => { setSampleLoc(loc.position ? loc : null); setShowAssign(false) }}
          onClose={() => setShowAssign(false)}
        />
      )}
    </div>
  )
}
