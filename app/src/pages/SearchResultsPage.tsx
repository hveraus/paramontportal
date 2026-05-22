import { useState, useMemo } from 'react'
import TopBar from '../components/TopBar'
import Sidebar from '../components/Sidebar'
import { useNavigation } from '../context/NavigationContext'
import { useLang } from '../context/LanguageContext'
import { MOCK_PRODUCTS } from '../mock/products'
import type { ProductListItem, ProductStatus } from '../mock/products'

// ── Abbreviation expansion ──────────────────────────────────────────────────

const ABBR_MAP: Record<string, string> = {
  wmt: 'walmart',
  wm:  'walmart',
  dt:  'dollar tree',
  tgt: 'target',
  fb:  'five below',
}

function expandAbbr(q: string): string {
  const lower = q.trim().toLowerCase()
  return ABBR_MAP[lower] ?? lower
}

// ── Keyword highlight ────────────────────────────────────────────────────────

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

// ── Status badge ─────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<ProductStatus, string> = {
  'Concept':         'bg-blue-100 text-blue-700',
  'Proposed':        'bg-violet-100 text-violet-700',
  'Pre-selected':    'bg-yellow-100 text-yellow-700',
  'Initial Sampled': 'bg-orange-100 text-orange-700',
  'Production':      'bg-emerald-100 text-emerald-700',
  'Dropped':         'bg-slate-100 text-slate-600',
}

function StatusBadge({ status }: { status: ProductStatus }) {
  return (
    <span className={`inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${STATUS_COLORS[status]}`}>
      {status}
    </span>
  )
}

// ── Filter pill ──────────────────────────────────────────────────────────────

function FilterPill({
  label, active, color, onClick,
}: {
  label: string; active: boolean; color?: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap
        ${active
          ? color ?? 'bg-blue-50 text-blue-700 border-blue-300'
          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
        }`}
    >
      {active && (
        <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="currentColor">
          <path d="M1.5 5.5L4 8l4.5-5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </svg>
      )}
      {label}
    </button>
  )
}

// ── Sort types ───────────────────────────────────────────────────────────────

type SortMode = 'relevance' | 'updated' | 'name'

// ── Scoring for relevance sort ────────────────────────────────────────────────

function relevanceScore(product: ProductListItem, query: string): number {
  const q = query.toLowerCase()
  if (product.name.toLowerCase().includes(q)) return 2
  if (product.itemNo.toLowerCase().includes(q)) return 1
  return 0
}

// ── Product card ─────────────────────────────────────────────────────────────

function ProductCard({
  product,
  query,
  onClick,
}: {
  product: ProductListItem
  query: string
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-200 hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
    >
      <div className="aspect-square w-full overflow-hidden rounded-t-2xl bg-slate-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <StatusBadge status={product.status} />
        <p className="text-sm font-medium text-slate-800 mt-1 line-clamp-2">
          <Highlight text={product.name} query={query} />
        </p>
        <p className="text-xs text-slate-400 mt-1">
          #{product.itemNo} · <Highlight text={product.category} query={query} />
        </p>
        {product.retail != null && (
          <p className="text-sm font-semibold text-slate-700 mt-2">
            ${product.retail.toFixed(2)}
          </p>
        )}
      </div>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────

const ALL_CATEGORIES = ['Crafts', 'Toys & Games', 'Art Supplies', 'Party & Seasonal', 'Stationery']
const ALL_STATUSES: ProductStatus[] = ['Concept', 'Proposed', 'Pre-selected', 'Initial Sampled', 'Production', 'Dropped']
const ALL_TEAMS: Array<'China' | 'US'> = ['China', 'US']

const STATUS_PILL_COLORS: Record<ProductStatus, string> = {
  'Concept':         'bg-blue-50 text-blue-700 border-blue-300',
  'Proposed':        'bg-violet-50 text-violet-700 border-violet-300',
  'Pre-selected':    'bg-yellow-50 text-yellow-700 border-yellow-300',
  'Initial Sampled': 'bg-orange-50 text-orange-700 border-orange-300',
  'Production':      'bg-emerald-50 text-emerald-700 border-emerald-300',
  'Dropped':         'bg-slate-100 text-slate-600 border-slate-300',
}

export default function SearchResultsPage() {
  const { searchQuery, navigate } = useNavigation()
  const { lang } = useLang()
  const [sortMode, setSortMode] = useState<SortMode>('relevance')
  const [selCategories, setSelCategories] = useState<string[]>([])
  const [selStatuses,   setSelStatuses]   = useState<ProductStatus[]>([])
  const [selTeams,      setSelTeams]      = useState<Array<'China' | 'US'>>([])

  const expandedQuery = expandAbbr(searchQuery)

  const hasFilters = selCategories.length > 0 || selStatuses.length > 0 || selTeams.length > 0

  function toggleItem<T>(arr: T[], setArr: (v: T[]) => void, item: T) {
    setArr(arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item])
  }

  const results = useMemo<ProductListItem[]>(() => {
    const q = expandedQuery
    const filtered = MOCK_PRODUCTS.filter(p => {
      const matchesQuery =
        p.name.toLowerCase().includes(q) ||
        p.itemNo.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q)
      const matchesCat    = selCategories.length === 0 || selCategories.includes(p.category)
      const matchesStatus = selStatuses.length   === 0 || selStatuses.includes(p.status)
      const matchesTeam   = selTeams.length      === 0 || selTeams.includes(p.country)
      return matchesQuery && matchesCat && matchesStatus && matchesTeam
    })

    if (sortMode === 'relevance') {
      return [...filtered].sort((a, b) => relevanceScore(b, q) - relevanceScore(a, q))
    }
    if (sortMode === 'updated') {
      return [...filtered].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    }
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name))
  }, [expandedQuery, sortMode, selCategories, selStatuses, selTeams])

  const sortOptions: { key: SortMode; labelEn: string; labelZh: string }[] = [
    { key: 'relevance', labelEn: 'Relevance', labelZh: '相关度' },
    { key: 'updated',   labelEn: 'Updated',   labelZh: '最近更新' },
    { key: 'name',      labelEn: 'Name',       labelZh: '名称' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TopBar />
      <div className="flex flex-1">
        <Sidebar topOffset={56} />
        <main className="flex-1 px-6 py-5 min-w-0">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
            <button
              onClick={() => navigate('dashboard')}
              className="hover:text-slate-600 transition-colors"
            >
              {lang === 'en' ? 'Home' : '首页'}
            </button>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-600">
              {lang === 'en' ? 'Search results' : '搜索结果'}
            </span>
          </nav>

          {/* Heading */}
          <div className="mb-5">
            <h1 className="text-xl font-bold text-slate-800">
              {lang === 'en' ? 'Search results for' : '搜索结果：'}{' '}
              <span className="text-blue-600">"{searchQuery}"</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {results.length} {lang === 'en' ? (results.length === 1 ? 'result' : 'results') : '个结果'}
              {hasFilters && (
                <span className="ml-2 text-xs text-blue-500">
                  {lang === 'en' ? '(filtered)' : '（已筛选）'}
                </span>
              )}
            </p>
          </div>

          {/* Filter bar */}
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 mb-4 space-y-2.5">
            {/* Category */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-16 flex-shrink-0">
                {lang === 'en' ? 'Category' : '品类'}
              </span>
              {ALL_CATEGORIES.map(cat => (
                <FilterPill
                  key={cat}
                  label={cat}
                  active={selCategories.includes(cat)}
                  onClick={() => toggleItem(selCategories, setSelCategories, cat)}
                />
              ))}
            </div>
            {/* Status */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-16 flex-shrink-0">
                {lang === 'en' ? 'Status' : '状态'}
              </span>
              {ALL_STATUSES.map(s => (
                <FilterPill
                  key={s}
                  label={s}
                  active={selStatuses.includes(s)}
                  color={STATUS_PILL_COLORS[s]}
                  onClick={() => toggleItem(selStatuses, setSelStatuses, s)}
                />
              ))}
            </div>
            {/* Team */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-16 flex-shrink-0">
                {lang === 'en' ? 'Team' : '团队'}
              </span>
              {ALL_TEAMS.map(t => (
                <FilterPill
                  key={t}
                  label={t === 'China' ? '🇨🇳 China' : '🇺🇸 US'}
                  active={selTeams.includes(t)}
                  onClick={() => toggleItem(selTeams, setSelTeams, t)}
                />
              ))}
              {hasFilters && (
                <button
                  onClick={() => { setSelCategories([]); setSelStatuses([]); setSelTeams([]) }}
                  className="ml-auto text-xs text-slate-400 hover:text-red-500 transition-colors"
                >
                  {lang === 'en' ? 'Clear all' : '清除筛选'}
                </button>
              )}
            </div>
          </div>

          {/* Sort bar */}
          {results.length > 0 && (
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xs font-medium text-slate-500 mr-1">
                {lang === 'en' ? 'Sort:' : '排序：'}
              </span>
              {sortOptions.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setSortMode(opt.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    sortMode === opt.key
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {lang === 'en' ? opt.labelEn : opt.labelZh}
                </button>
              ))}
            </div>
          )}

          {/* Results grid */}
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {results.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  query={expandedQuery}
                  onClick={() => navigate('product-detail')}
                />
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-700 mb-1">
                {lang === 'en' ? 'No results found' : '未找到结果'}
              </h3>
              <p className="text-sm text-slate-400 max-w-xs">
                {lang === 'en'
                  ? `No products match "${searchQuery}". Try a different search term.`
                  : `没有与 "${searchQuery}" 匹配的产品，请尝试其他关键词。`}
              </p>
              <button
                onClick={() => navigate('products')}
                className="mt-5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                {lang === 'en' ? 'Browse all products' : '浏览所有产品'}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
