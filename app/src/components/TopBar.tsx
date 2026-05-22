import { useState, useRef } from 'react'
import { useRole } from '../context/RoleContext'
import { useLang } from '../context/LanguageContext'
import { useNavigation } from '../context/NavigationContext'
import { MOCK_PRODUCTS } from '../mock/products'
import type { UserRole, ProductStatus } from '../types'

const ROLE_LABELS: Record<UserRole, string> = {
  admin:           'Admin',
  product_manager: 'Product Manager',
  pd_china:        'PD Designer (China)',
  pd_us:           'PD Designer (US)',
  sales:           'Sales',
}

const LANGUAGES = [
  { code: 'en' as const, label: 'EN', flag: '🇺🇸' },
  { code: 'zh' as const, label: '中文', flag: '🇨🇳' },
]

const ABBR_MAP: Record<string, string> = {
  wmt: 'walmart',
  wm: 'walmart',
  dt: 'dollar tree',
  tgt: 'target',
  fb: 'five below',
}

const STATUS_COLORS: Record<ProductStatus, string> = {
  'Concept':        'bg-blue-100 text-blue-700',
  'Proposed':       'bg-violet-100 text-violet-700',
  'Pre-selected':   'bg-yellow-100 text-yellow-700',
  'Initial Sampled':'bg-orange-100 text-orange-700',
  'Production':     'bg-emerald-100 text-emerald-700',
  'Dropped':        'bg-slate-100 text-slate-600',
}

function expandAbbr(q: string): string {
  const lower = q.trim().toLowerCase()
  return ABBR_MAP[lower] ?? lower
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>
  const safe = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${safe})`, 'gi'))
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === query.toLowerCase()
          ? <mark key={i} className="bg-yellow-100 text-yellow-900 rounded-sm px-0.5 not-italic">{p}</mark>
          : p
      )}
    </>
  )
}

export default function TopBar() {
  const { role, setRole, currentUser } = useRole()
  const { lang, setLang } = useLang()
  const { navigate, setSearchQuery } = useNavigation()
  const [langOpen, setLangOpen]       = useState(false)
  const [roleOpen, setRoleOpen]       = useState(false)
  const [notifOpen, setNotifOpen]     = useState(false)
  const [inputValue, setInputValue]   = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Pom-Pom Yarn',
    'WMT Holiday Craft',
    'Foam Sticker',
    'Watercolor Paint',
    'Embroidery Kit',
  ])
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const activeLang = LANGUAGES.find(l => l.code === lang) ?? LANGUAGES[0]

  const expandedQuery = expandAbbr(inputValue)

  const liveResults = inputValue.trim()
    ? MOCK_PRODUCTS.filter(p => {
        const q = expandedQuery
        return (
          p.name.toLowerCase().includes(q) ||
          p.itemNo.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q)
        )
      }).slice(0, 5)
    : []

  function handleSearch(q: string) {
    if (!q.trim()) return
    setRecentSearches(prev => {
      const deduped = [q, ...prev.filter(r => r !== q)]
      return deduped.slice(0, 10)
    })
    setSearchQuery(q)
    navigate('search')
    setDropdownOpen(false)
    setInputValue(q)
  }

  function handleFocus() {
    if (blurTimer.current) clearTimeout(blurTimer.current)
    setDropdownOpen(true)
  }

  function handleBlur() {
    blurTimer.current = setTimeout(() => setDropdownOpen(false), 150)
  }

  function dismissRecent(term: string, e: React.MouseEvent) {
    e.stopPropagation()
    setRecentSearches(prev => prev.filter(r => r !== term))
  }

  return (
    <header className="sticky top-0 z-40 h-14 bg-white border-b border-slate-200 grid grid-cols-3 items-center px-5">

      {/* Col 1 — Logo + system name */}
      <div className="w-56 flex-shrink-0 flex items-center gap-2.5">
        <img
          src={`${import.meta.env.BASE_URL}logo-paramont-global.png`}
          alt="Paramont Global"
          className="h-11 w-auto object-contain flex-shrink-0"
        />
        <div className="flex flex-col leading-none">
          <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">PDM</span>
          <span className="text-base font-bold text-slate-800 tracking-tight -mt-1">Portal</span>
        </div>
      </div>

      {/* Col 2 — Search */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={e => { if (e.key === 'Enter') handleSearch(inputValue) }}
            placeholder={lang === 'en' ? 'Search products, projects, clients…' : '搜索产品、项目、客户…'}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg
                       placeholder-slate-400 text-slate-700 focus:outline-none focus:ring-2
                       focus:ring-blue-500/30 focus:border-blue-400 transition-colors"
          />

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute left-0 top-full mt-1 w-full z-50 bg-white rounded-xl shadow-lg border border-slate-200">

              {/* Empty input: recent searches */}
              {!inputValue.trim() && (
                <div className="py-2">
                  <p className="px-3 pt-1 pb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {lang === 'en' ? 'Recent Searches' : '最近搜索'}
                  </p>
                  {recentSearches.length === 0 && (
                    <p className="px-3 py-3 text-sm text-slate-400 text-center">
                      {lang === 'en' ? 'No recent searches' : '暂无搜索记录'}
                    </p>
                  )}
                  {recentSearches.slice(0, 5).map(term => (
                    <button
                      key={term}
                      onMouseDown={() => handleSearch(term)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 transition-colors text-left"
                    >
                      {/* Clock icon */}
                      <svg className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="flex-1 text-sm text-slate-700">{term}</span>
                      <span
                        onMouseDown={e => dismissRecent(term, e)}
                        className="text-slate-400 hover:text-slate-600 text-xs px-1 cursor-pointer"
                        role="button"
                        aria-label="Remove"
                      >
                        ×
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Has input: live results */}
              {inputValue.trim() && (
                <div className="py-2">
                  {liveResults.length === 0 && (
                    <p className="px-3 py-3 text-sm text-slate-400 text-center">
                      {lang === 'en' ? 'No matches found' : '未找到匹配结果'}
                    </p>
                  )}
                  {liveResults.map(product => (
                    <button
                      key={product.id}
                      onMouseDown={() => handleSearch(product.name)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 transition-colors text-left"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-8 h-8 rounded-md object-cover flex-shrink-0 border border-slate-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">
                          <Highlight text={product.name} query={expandedQuery} />
                        </p>
                        <p className="text-xs text-slate-400">#{product.itemNo}</p>
                      </div>
                      <span className={`flex-shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${STATUS_COLORS[product.status]}`}>
                        {product.status}
                      </span>
                    </button>
                  ))}
                  {/* Search for '{query}' row */}
                  <button
                    onMouseDown={() => handleSearch(inputValue)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors border-t border-slate-100 mt-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {lang === 'en' ? `Search for "${inputValue}"` : `搜索 "${inputValue}"`}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Col 3 — Right-side controls */}
      <div className="flex items-center justify-end gap-1">

        {/* Language switcher */}
        <div className="relative">
          <button
            onClick={() => { setLangOpen(p => !p); setRoleOpen(false); setNotifOpen(false) }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-600
                       hover:bg-slate-100 transition-colors"
          >
            <span className="text-base leading-none">{activeLang.flag}</span>
            <span className="font-medium">{activeLang.label}</span>
            <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {langOpen && (
            <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl border border-slate-200 shadow-lg py-1 z-50">
              {LANGUAGES.map(l => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setLangOpen(false) }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors
                    ${lang === l.code ? 'text-blue-700 bg-blue-50' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  <span className="text-base">{l.flag}</span>
                  {l.label}
                  {lang === l.code && (
                    <svg className="w-3.5 h-3.5 ml-auto text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(p => !p); setLangOpen(false); setRoleOpen(false) }}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-500
                       hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-1 w-72 bg-white rounded-xl border border-slate-200 shadow-lg z-50">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800">{lang === 'en' ? 'Notifications' : '通知'}</p>
                <span className="text-xs text-blue-600 font-medium">{lang === 'en' ? 'Mark all read' : '全部已读'}</span>
              </div>
              {[
                { text: lang === 'en' ? 'QC report uploaded for PDM-20241001-138' : 'PDM-20241001-138 质检报告已上传', time: '2h ago', unread: true },
                { text: lang === 'en' ? 'Sarah commented on Pom-Pom Yarn Kit' : 'Sarah 评论了 Pom-Pom 毛线套装', time: '5h ago', unread: true },
                { text: lang === 'en' ? 'Stage updated to Finished on item 1008820' : '产品 1008820 阶段更新为 Finished', time: lang === 'en' ? 'Yesterday' : '昨天', unread: false },
              ].map((n, i) => (
                <div key={i} className={`flex gap-3 px-4 py-3 border-b border-slate-50 last:border-0 ${n.unread ? 'bg-blue-50/40' : ''}`}>
                  {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />}
                  {!n.unread && <span className="w-1.5 h-1.5 flex-shrink-0" />}
                  <div>
                    <p className="text-xs text-slate-700 leading-snug">{n.text}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Role switcher */}
        <div className="relative">
          <button
            onClick={() => { setRoleOpen(p => !p); setLangOpen(false); setNotifOpen(false) }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <img src={currentUser.avatar} alt={currentUser.name} className="w-7 h-7 rounded-full" />
            <div className="text-left">
              <p className="text-xs font-semibold text-slate-800 leading-none">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-none">{ROLE_LABELS[role]}</p>
            </div>
            <svg className="w-3 h-3 text-slate-400 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {roleOpen && (
            <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl border border-slate-200 shadow-lg py-1 z-50">
              <p className="px-3 pt-1.5 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                {lang === 'en' ? 'Preview as role' : '切换角色预览'}
              </p>
              {(Object.keys(ROLE_LABELS) as UserRole[]).map(r => (
                <button
                  key={r}
                  onClick={() => { setRole(r); setRoleOpen(false) }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors
                    ${role === r ? 'text-blue-700 bg-blue-50' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  {ROLE_LABELS[r]}
                  {role === r && (
                    <svg className="w-3.5 h-3.5 ml-auto text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
