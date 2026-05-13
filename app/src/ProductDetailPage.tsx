import { useState, useRef, useEffect } from 'react'
import { mockProduct } from './mock/productDetail'
import { useRole } from './context/RoleContext'
import Breadcrumb from './components/Breadcrumb'
import ImageGallery from './components/ImageGallery'
import StatusTag from './components/StatusTag'
import BasicInfoTab from './components/tabs/BasicInfoTab'
import SpecsTab from './components/tabs/SpecsTab'
import PackagingTab from './components/tabs/PackagingTab'
import QualityTab from './components/tabs/QualityTab'
import CostTab from './components/tabs/CostTab'
import CustomsTab from './components/tabs/CustomsTab'
import PatentsTab from './components/tabs/PatentsTab'
import CertificationsTab from './components/tabs/CertificationsTab'
import ActivityPanel from './components/ActivityPanel'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'

type TabId = 'basic' | 'specs' | 'packaging' | 'quality' | 'cost' | 'customs' | 'certifications' | 'patents'

const TABS: { id: TabId; label: string; costOnly?: boolean; patentOnly?: boolean }[] = [
  { id: 'basic',           label: 'Basic Info' },
  { id: 'specs',           label: 'Specifications' },
  { id: 'packaging',       label: 'Packaging' },
  { id: 'quality',         label: 'Quality' },
  { id: 'cost',            label: 'Costings',       costOnly: true },
  { id: 'customs',         label: 'Customs' },
  { id: 'certifications',  label: 'Certifications' },
  { id: 'patents',         label: 'Patents',        patentOnly: true },
]

const STATUS_VARIANT: Record<string, 'blue' | 'green' | 'red' | 'purple' | 'yellow' | 'orange' | 'gray'> = {
  'Concept':        'blue',
  'Proposed':       'purple',
  'Pre-selected':   'yellow',
  'Initial Sampled':'orange',
  'Final':          'green',
  'Dropped':        'gray',
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

// ── Edit button ────────────────────────────────────────────────────────────

function EditButton() {
  return (
    <button className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border
      bg-blue-600 text-white border-blue-600 hover:bg-blue-700 transition-colors font-medium">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
      Edit
    </button>
  )
}

export default function ProductDetailPage() {
  const { can } = useRole()
  const [activeTab, setActiveTab] = useState<TabId>('basic')
  const product = mockProduct

  const visibleTabs = TABS.filter((t) =>
    (!t.costOnly || can('view_cost')) && (!t.patentOnly || can('view_patents'))
  )
  const resolvedTab = visibleTabs.find((t) => t.id === activeTab)
    ? activeTab
    : (visibleTabs[0]?.id ?? 'basic')

  const statusVariant = STATUS_VARIANT[product.status] ?? 'gray'

  return (
    <div className="min-h-screen bg-slate-100">
      <TopBar />

      {/* Page body: sidebar + content */}
      <div className="flex">
        <Sidebar topOffset={56} />

        <div className="flex-1 min-w-0 px-6 py-5 space-y-4">
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
              <StatusTag label={product.status} variant={statusVariant} />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <ExportDropdown />
            <FavoriteButton />
            <AddToProposalButton />
            <div className="w-px h-5 bg-slate-200 mx-1" />
            <EditButton />
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
                    onClick={() => setActiveTab(tab.id)}
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
              <div className="p-6">
                {resolvedTab === 'basic'     && <BasicInfoTab   product={product} />}
                {resolvedTab === 'specs'     && <SpecsTab       product={product} />}
                {resolvedTab === 'packaging' && <PackagingTab   product={product} />}
                {resolvedTab === 'quality'   && <QualityTab     qualityRecords={product.qualityRecords} />}
                {resolvedTab === 'cost'      && <CostTab        product={product} />}
                {resolvedTab === 'customs'   && <CustomsTab     product={product} />}
                {resolvedTab === 'certifications' && <CertificationsTab certifications={product.certifications} />}
                {resolvedTab === 'patents'        && <PatentsTab        patents={product.patents} />}
              </div>
            </div>
          </div>
        </div>

        {/* Comments + Change History */}
        <ActivityPanel
          comments={product.comments}
          records={product.iterationRecords}
        />

        <div className="h-8" />
        </div> {/* end content column */}
      </div> {/* end flex row */}
    </div>
  )
}
