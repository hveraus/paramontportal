import { useState } from 'react'
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

const STAGE_VARIANT: Record<string, 'blue' | 'green' | 'red'> = {
  Concept:      'blue',
  Finished:     'green',
  Discontinued: 'red',
}

function ActionBtn({
  icon, label, onClick, primary,
}: {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  primary?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border
        transition-colors
        ${primary
          ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800'
        }`}
    >
      {icon}
      {label}
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

  const stageVariant = STAGE_VARIANT[product.stage] ?? 'gray'

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
              <StatusTag
                label={product.itemStatus}
                variant={product.itemStatus === 'ACTIVE' ? 'green' : product.itemStatus === 'HOLD' ? 'orange' : 'red'}
              />
              <StatusTag label={product.stage} variant={stageVariant} />
            </div>
          </div>

          <div className="flex items-center">
            <ActionBtn
              label="Edit"
              primary
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
            />
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
