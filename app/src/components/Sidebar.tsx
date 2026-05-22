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

function IconArchive() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
  )
}
function IconSampleRoom() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  )
}

// ── Nav items ──────────────────────────────────────────────────────────────

type NavPage = 'dashboard' | 'products' | 'archives' | 'sample-room' | 'program'

const NAV_ITEMS: { label: string; icon: React.ReactNode; page?: NavPage; matchPages?: string[] }[] = [
  { label: 'Home',        icon: <IconHome />,       page: 'dashboard' },
  { label: 'Products',    icon: <IconBox />,        page: 'products',     matchPages: ['products', 'product-detail'] },
  { label: 'Archives',    icon: <IconArchive />,    page: 'archives' },
  { label: 'Sample Room', icon: <IconSampleRoom />, page: 'sample-room' },
  { label: 'Program',     icon: <IconFolder />,    page: 'program' },
  { label: 'Customers',   icon: <IconUsers /> },
]

// ── Component ──────────────────────────────────────────────────────────────

export default function Sidebar({ topOffset = 44 }: { topOffset?: number }) {
  const { page, navigate } = useNavigation()

  return (
    <aside
      className="w-56 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-y-auto"
      style={{ position: 'sticky', top: topOffset, height: `calc(100vh - ${topOffset}px)` }}
    >
      {/* Main nav */}
      <nav className="px-3 py-3 space-y-0.5">
        {NAV_ITEMS.map(item => {
          const active = item.matchPages
            ? item.matchPages.includes(page)
            : item.page ? page === item.page : false
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

      {/* Browse by Category — hidden */}

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
