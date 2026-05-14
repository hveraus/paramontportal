import { useState } from 'react'
import { useNavigation } from '../context/NavigationContext'

// ── Icons ──────────────────────────────────────────────────────────────────

function IconHome() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}
function IconBox() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11" />
    </svg>
  )
}
function IconFolder() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    </svg>
  )
}
function IconUsers() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}
function IconSettings() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}
function IconChevron({ open }: { open: boolean }) {
  return (
    <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}

// ── Category data ──────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    name: 'Crafts',
    active: true,
    children: ['Yarn', 'Paper Craft', 'Drawing & Painting', 'Sewing & Needlework'],
  },
  {
    name: 'Toys & Games',
    active: false,
    children: ['Outdoor Toys', 'Board Games', 'Educational', 'Puzzles'],
  },
  {
    name: 'Art Supplies',
    active: false,
    children: ['Brushes & Tools', 'Canvas & Paper', 'Paints'],
  },
  {
    name: 'Party & Seasonal',
    active: false,
    children: ['Holiday Décor', 'Party Supplies', 'Gift Wrap'],
  },
  {
    name: 'Stationery',
    active: false,
    children: ['Notebooks', 'Writing Instruments', 'Accessories'],
  },
]

// ── Nav items ──────────────────────────────────────────────────────────────

const NAV_ITEMS: { label: string; icon: React.ReactNode; page?: 'dashboard' | 'products' | 'product-detail' }[] = [
  { label: 'Home',     icon: <IconHome />,   page: 'dashboard' },
  { label: 'Products', icon: <IconBox />,    page: 'products' },
  { label: 'Projects', icon: <IconFolder />  },
  { label: 'Clients',  icon: <IconUsers />   },
]

// ── Component ──────────────────────────────────────────────────────────────

export default function Sidebar({ topOffset = 44 }: { topOffset?: number }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ Crafts: true })
  const { page, navigate } = useNavigation()

  return (
    <aside
      className="w-56 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-y-auto"
      style={{ position: 'sticky', top: topOffset, height: `calc(100vh - ${topOffset}px)` }}
    >
      {/* Main nav */}
      <nav className="px-3 py-3 space-y-0.5">
        {NAV_ITEMS.map(item => {
          const active = item.page
            ? page === item.page
              || (item.page === 'products' && page === 'product-detail')
              || (item.page === 'dashboard' && page === 'dashboard')
            : false
          return (
            <button
              key={item.label}
              onClick={() => item.page && navigate(item.page)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left
                ${active
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              <span className={active ? 'text-blue-600' : 'text-slate-400'}>{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Divider */}
      <div className="mx-3 border-t border-slate-100 my-1" />

      {/* Browse by Category */}
      <div className="px-3 py-3 flex-1 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
          Browse by Category
        </p>

        <div className="space-y-0.5">
          {CATEGORIES.map(cat => (
            <div key={cat.name}>
              {/* Parent category */}
              <button
                onClick={() => setExpanded(prev => ({ ...prev, [cat.name]: !prev[cat.name] }))}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                  ${cat.active
                    ? 'text-blue-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <span className="truncate">{cat.name}</span>
                <span className="text-slate-300 flex-shrink-0">
                  <IconChevron open={!!expanded[cat.name]} />
                </span>
              </button>

              {/* Children */}
              {expanded[cat.name] && (
                <div className="ml-3 pl-3 border-l border-slate-100 space-y-0.5 mb-1">
                  {cat.children.map(child => (
                    <button
                      key={child}
                      className={`w-full text-left px-2 py-1.5 rounded-md text-xs transition-colors
                        ${cat.active && child === 'Yarn'
                          ? 'text-blue-600 font-medium bg-blue-50'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                        }`}
                    >
                      {child}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Settings — pinned to bottom */}
      <div className="mt-auto px-3 py-3 border-t border-slate-100">
        <button
          onClick={() => navigate('settings')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors group
            ${page === 'settings' || page === 'settings-permissions'
              ? 'bg-blue-50 text-blue-700 font-medium'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
        >
          <span className={page === 'settings' || page === 'settings-permissions' ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600 transition-colors'}>
            <IconSettings />
          </span>
          Settings
        </button>
      </div>
    </aside>
  )
}
