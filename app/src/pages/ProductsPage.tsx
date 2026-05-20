import { useState, useMemo } from 'react'
import TopBar from '../components/TopBar'
import Sidebar from '../components/Sidebar'
import { useNavigation } from '../context/NavigationContext'
import { MOCK_PRODUCTS, CATEGORY_TREE, type ProductListItem } from '../mock/products'

const PAGE_SIZE = 12
const TOTAL_RESULTS = 47 // simulated total

// ── Types ─────────────────────────────────────────────────────────────────

interface FilterState {
  categories: string[]
  statuses: string[]
  countries: string[]
  hasPatent: boolean | null
  committed: boolean | null
  priceRange: [number, number]
  moqRange: [number, number]
}

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  statuses: [],
  countries: [],
  hasPatent: null,
  committed: null,
  priceRange: [0, 50],
  moqRange: [0, 100000],
}

// ── Dual range slider ─────────────────────────────────────────────────────

function DualSlider({
  min, max, low, high, step = 1, prefix = '',
  onChange,
}: {
  min: number; max: number; low: number; high: number
  step?: number; prefix?: string
  onChange: (low: number, high: number) => void
}) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100
  return (
    <div className="py-2">
      <div className="relative h-6">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 bg-slate-200 rounded-full" />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1.5 bg-blue-500 rounded-full"
          style={{ left: `${pct(low)}%`, right: `${100 - pct(high)}%` }}
        />
        <input type="range" min={min} max={max} step={step} value={low}
          onChange={e => onChange(Math.min(+e.target.value, high - step), high)}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          style={{ zIndex: low > max * 0.9 ? 5 : 3 }}
        />
        <input type="range" min={min} max={max} step={step} value={high}
          onChange={e => onChange(low, Math.max(+e.target.value, low + step))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          style={{ zIndex: 4 }}
        />
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow-sm pointer-events-none"
          style={{ left: `${pct(low)}%`, zIndex: 6 }} />
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow-sm pointer-events-none"
          style={{ left: `${pct(high)}%`, zIndex: 6 }} />
      </div>
      <div className="flex justify-between text-xs text-slate-600 mt-2 font-medium">
        <span className="bg-slate-100 rounded px-2 py-0.5">{prefix}{low.toLocaleString()}</span>
        <span className="bg-slate-100 rounded px-2 py-0.5">{prefix}{high.toLocaleString()}</span>
      </div>
    </div>
  )
}

// ── Filter section accordion ──────────────────────────────────────────────

function FilterSection({ title, children, defaultOpen = true }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between py-3 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
      >
        {title}
        <svg className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  )
}

// ── Checkbox helper ───────────────────────────────────────────────────────

function Checkbox({ label, checked, onChange, indeterminate = false, count }: {
  label: string; checked: boolean; onChange: () => void; indeterminate?: boolean; count?: number
}) {
  return (
    <label className="flex items-center gap-2.5 py-1 cursor-pointer group">
      <div className={`w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors
        ${checked || indeterminate
          ? 'bg-blue-600 border-blue-600'
          : 'border-slate-300 group-hover:border-blue-400'}`}
        onClick={onChange}
      >
        {checked && <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="currentColor">
          <path d="M1.5 5.5L4 8l4.5-5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>}
        {indeterminate && <div className="w-2 h-0.5 bg-white rounded" />}
      </div>
      <span className="flex-1 text-sm text-slate-600 group-hover:text-slate-900 transition-colors select-none">{label}</span>
      {count !== undefined && (
        <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full min-w-[20px] text-center leading-none transition-colors
          ${checked || indeterminate
            ? 'bg-blue-100 text-blue-600'
            : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
          {count}
        </span>
      )}
    </label>
  )
}

// ── Filter panel ──────────────────────────────────────────────────────────

function FilterPanel({ filters, onChange, categoryCounts }: {
  filters: FilterState
  onChange: (f: FilterState) => void
  categoryCounts: Record<string, number>
}) {
  const toggle = (key: 'categories' | 'statuses' | 'countries', val: string) => {
    const arr = filters[key]
    onChange({ ...filters, [key]: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val] })
  }
  const toggleParentCat = (_parent: string, children: string[]) => {
    const allSelected = children.every(c => filters.categories.includes(c))
    const without = filters.categories.filter(c => !children.includes(c))
    onChange({ ...filters, categories: allSelected ? without : [...without, ...children] })
  }

  return (
    <aside className="w-64 flex-shrink-0 bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sticky top-[76px]">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-slate-800">Filters</p>
        <button
          onClick={() => onChange(DEFAULT_FILTERS)}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >Reset all</button>
      </div>

      {/* Category */}
      <FilterSection title="Category">
        <div className="space-y-0.5">
          {CATEGORY_TREE.map(cat => {
            const allSelected = cat.children.every(c => filters.categories.includes(c))
            const someSelected = cat.children.some(c => filters.categories.includes(c))
            const parentCount = cat.children.reduce((sum, c) => sum + (categoryCounts[c] ?? 0), 0)
            return (
              <div key={cat.name}>
                <Checkbox
                  label={cat.name}
                  checked={allSelected}
                  indeterminate={!allSelected && someSelected}
                  onChange={() => toggleParentCat(cat.name, cat.children)}
                  count={parentCount || undefined}
                />
                <div className="ml-5 space-y-0.5">
                  {cat.children.map(child => (
                    <Checkbox
                      key={child} label={child}
                      checked={filters.categories.includes(child)}
                      onChange={() => toggle('categories', child)}
                      count={categoryCounts[child] || undefined}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </FilterSection>

      {/* Status */}
      <FilterSection title="Status">
        {(['Concept', 'Proposed', 'Pre-selected', 'Initial Sampled', 'Production', 'Dropped'] as const).map(s => (
          <Checkbox key={s} label={s}
            checked={filters.statuses.includes(s)}
            onChange={() => toggle('statuses', s)}
          />
        ))}
      </FilterSection>

      {/* Price range */}
      <FilterSection title="Retail Price (USD)" defaultOpen={false}>
        <DualSlider min={0} max={50} low={filters.priceRange[0]} high={filters.priceRange[1]}
          step={0.25} prefix="$"
          onChange={(l, h) => onChange({ ...filters, priceRange: [l, h] })}
        />
      </FilterSection>

      {/* Country */}
      <FilterSection title="Country of Origin" defaultOpen={false}>
        {(['China', 'US'] as const).map(c => (
          <label key={c} className="flex items-center gap-2.5 py-1 cursor-pointer group">
            <div className={`w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors
              ${filters.countries.includes(c)
                ? 'bg-blue-600 border-blue-600'
                : 'border-slate-300 group-hover:border-blue-400'}`}
              onClick={() => toggle('countries', c)}
            >
              {filters.countries.includes(c) && (
                <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 5.5L4 8l4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </div>
            <span className="text-sm text-slate-600 select-none">
              {c === 'China' ? '🇨🇳' : '🇺🇸'} {c}
            </span>
          </label>
        ))}
      </FilterSection>

      {/* Has Patent */}
      <FilterSection title="Has Patent" defaultOpen={false}>
        {([null, true, false] as const).map(v => (
          <label key={String(v)} className="flex items-center gap-2.5 py-1 cursor-pointer">
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors
              ${filters.hasPatent === v
                ? 'border-blue-600 bg-blue-600'
                : 'border-slate-300'}`}
              onClick={() => onChange({ ...filters, hasPatent: v })}
            >
              {filters.hasPatent === v && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
            </div>
            <span className="text-sm text-slate-600 select-none">
              {v === null ? 'All' : v ? 'Yes' : 'No'}
            </span>
          </label>
        ))}
      </FilterSection>

      {/* MOQ range */}
      <FilterSection title="MOQ Range" defaultOpen={false}>
        <DualSlider min={0} max={100000} low={filters.moqRange[0]} high={filters.moqRange[1]}
          step={1000}
          onChange={(l, h) => onChange({ ...filters, moqRange: [l, h] })}
        />
      </FilterSection>

      {/* Committed */}
      <FilterSection title="Committed" defaultOpen={false}>
        {([null, true, false] as const).map(v => (
          <label key={String(v)} className="flex items-center gap-2.5 py-1 cursor-pointer">
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors
              ${filters.committed === v
                ? 'border-blue-600 bg-blue-600'
                : 'border-slate-300'}`}
              onClick={() => onChange({ ...filters, committed: v })}
            >
              {filters.committed === v && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
            </div>
            <span className="text-sm text-slate-600 select-none">
              {v === null ? 'All' : v ? 'Yes' : 'No'}
            </span>
          </label>
        ))}
      </FilterSection>
    </aside>
  )
}

// ── Product card ──────────────────────────────────────────────────────────

const STATUS_COLOR: Record<string, string> = {
  'Concept':        'bg-blue-50 text-blue-700 border border-blue-200',
  'Proposed':       'bg-violet-50 text-violet-700 border border-violet-200',
  'Pre-selected':   'bg-amber-50 text-amber-700 border border-amber-200',
  'Initial Sampled':'bg-orange-50 text-orange-700 border border-orange-200',
  'Production':     'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'Dropped':        'bg-slate-100 text-slate-500 border border-slate-200',
}

function ProductCard({ product, onView }: { product: ProductListItem; onView: () => void }) {
  const date = new Date(product.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return (
    <div
      onClick={onView}
      className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm
                 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={product.image} alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold text-white
                           bg-blue-600 px-3 py-1.5 rounded-full shadow-lg translate-y-1 group-hover:translate-y-0 transition-transform duration-200">
            View Details
          </span>
        </div>
        {/* Country flag */}
        <div className="absolute top-2.5 right-2.5 text-lg leading-none drop-shadow-sm">
          {product.country === 'China' ? '🇨🇳' : '🇺🇸'}
        </div>
        {product.hasPatent && (
          <div className="absolute top-2.5 left-2.5 bg-amber-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-tight shadow-sm">
            Patent
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3.5 space-y-2">
        <p className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug">{product.name}</p>
        <p className="text-xs font-mono text-slate-400">#{product.itemNo}</p>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[product.status] ?? 'bg-slate-100 text-slate-500'}`}>
            {product.status}
          </span>
          {product.committed && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
              Committed
            </span>
          )}
        </div>
        <div className="flex items-center justify-between pt-0.5">
          <span className="text-sm font-semibold text-slate-800">
            {product.retail !== null ? `$${product.retail.toFixed(2)}` : '—'}
          </span>
          <span className="text-xs text-slate-400">{date}</span>
        </div>
      </div>
    </div>
  )
}

// ── List row view ─────────────────────────────────────────────────────────

function ProductRow({ product, onView }: { product: ProductListItem; onView: () => void }) {
  const date = new Date(product.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return (
    <div
      onClick={onView}
      className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl px-4 py-3
                 hover:shadow-sm hover:border-blue-300 transition-all duration-150 cursor-pointer"
    >
      <img src={product.image} alt={product.name}
        className="w-16 h-12 object-cover rounded-lg flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 truncate">{product.name}</p>
        <p className="text-xs text-slate-400 font-mono mt-0.5">#{product.itemNo} · {product.category} / {product.subcategory}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[product.status] ?? 'bg-slate-100 text-slate-500'}`}>
          {product.status}
        </span>
      </div>
      <div className="text-sm font-semibold text-slate-800 w-16 text-right flex-shrink-0">
        {product.retail !== null ? `$${product.retail.toFixed(2)}` : '—'}
      </div>
      <div className="text-xs text-slate-400 w-24 text-right flex-shrink-0">{date}</div>
      <div className="text-lg flex-shrink-0">{product.country === 'China' ? '🇨🇳' : '🇺🇸'}</div>
    </div>
  )
}

// ── Pagination ─────────────────────────────────────────────────────────────

function Pagination({ page, total, pageSize, onChange }: {
  page: number; total: number; pageSize: number; onChange: (p: number) => void
}) {
  const totalPages = Math.ceil(total / pageSize)
  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1)
  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-sm text-slate-500">
        Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total} results
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)} disabled={page === 1}
          className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600
                     hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >← Prev</button>
        {pages.map(p => (
          <button key={p} onClick={() => onChange(p)}
            className={`w-8 h-8 text-sm rounded-lg transition-colors
              ${p === page
                ? 'bg-blue-600 text-white font-semibold'
                : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >{p}</button>
        ))}
        <button
          onClick={() => onChange(page + 1)} disabled={page === totalPages}
          className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600
                     hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >Next →</button>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const { navigate } = useNavigation()
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [sortBy, setSortBy] = useState('latest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [page, setPage] = useState(1)

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    MOCK_PRODUCTS.forEach(p => {
      counts[p.subcategory] = (counts[p.subcategory] ?? 0) + 1
    })
    return counts
  }, [])

  const filtered = useMemo(() => {
    let list = [...MOCK_PRODUCTS]
    if (filters.categories.length) list = list.filter(p => filters.categories.includes(p.subcategory))
    if (filters.statuses.length)   list = list.filter(p => filters.statuses.includes(p.status))
    if (filters.countries.length)  list = list.filter(p => filters.countries.includes(p.country))
    if (filters.hasPatent !== null) list = list.filter(p => p.hasPatent === filters.hasPatent)
    if (filters.committed !== null) list = list.filter(p => p.committed === filters.committed)
    list = list.filter(p => p.retail === null || (p.retail >= filters.priceRange[0] && p.retail <= filters.priceRange[1]))
    list = list.filter(p => p.moq === null || (p.moq >= filters.moqRange[0] && p.moq <= filters.moqRange[1]))
    return list
  }, [filters])

  const sorted = useMemo(() => {
    const list = [...filtered]
    if (sortBy === 'latest') list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    if (sortBy === 'price-asc')  list.sort((a, b) => (a.retail ?? 0) - (b.retail ?? 0))
    if (sortBy === 'price-desc') list.sort((a, b) => (b.retail ?? 0) - (a.retail ?? 0))
    return list
  }, [filtered, sortBy])

  // Simulate larger total for pagination display
  const displayTotal = filters.categories.length || filters.statuses.length ||
    filters.countries.length || filters.hasPatent !== null || filters.committed !== null
    ? sorted.length
    : TOTAL_RESULTS

  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const activeFilterCount = [
    filters.categories.length,
    filters.statuses.length,
    filters.countries.length,
    filters.hasPatent !== null ? 1 : 0,
    filters.committed !== null ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  return (
    <div className="min-h-screen bg-slate-100">
      <TopBar />
      <div className="flex">
        <Sidebar topOffset={56} />

        <div className="flex-1 min-w-0 px-6 py-5">
          {/* Page header */}
          <div className="mb-5">
            <p className="text-xs text-slate-400 mb-1">
              <span className="hover:text-slate-600 cursor-pointer">Home</span>
              <span className="mx-1.5">›</span>
              <span className="text-slate-600">Products</span>
            </p>
            <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          </div>

          {/* Content */}
          <div className="flex gap-5 items-start">
            {/* Filter panel */}
            <FilterPanel filters={filters} onChange={(f) => { setFilters(f); setPage(1) }} categoryCounts={categoryCounts} />

            {/* Results */}
            <div className="flex-1 min-w-0 space-y-4">
              {/* Results header */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-4 py-3 flex items-center gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-slate-800">
                    Found {displayTotal} results
                  </span>
                  {activeFilterCount > 0 && (
                    <span className="ml-2 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium">
                      {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
                    </span>
                  )}
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Sort:</span>
                  <select
                    value={sortBy} onChange={e => setSortBy(e.target.value)}
                    className="text-sm border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700
                               bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                  >
                    <option value="latest">Latest Updated</option>
                    <option value="relevance">Relevance</option>
                    <option value="price-asc">Price: Low → High</option>
                    <option value="price-desc">Price: High → Low</option>
                  </select>
                </div>

                {/* View toggle */}
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1.5 transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                      <rect x="1" y="1" width="6" height="6" rx="1"/>
                      <rect x="9" y="1" width="6" height="6" rx="1"/>
                      <rect x="1" y="9" width="6" height="6" rx="1"/>
                      <rect x="9" y="9" width="6" height="6" rx="1"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1.5 transition-colors border-l border-slate-200 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                      <rect x="1" y="2" width="14" height="2.5" rx="1"/>
                      <rect x="1" y="6.75" width="14" height="2.5" rx="1"/>
                      <rect x="1" y="11.5" width="14" height="2.5" rx="1"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Grid / List */}
              {paginated.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col items-center justify-center py-16">
                  <svg className="w-12 h-12 text-slate-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-sm font-semibold text-slate-500">No products match your filters</p>
                  <button onClick={() => setFilters(DEFAULT_FILTERS)}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Clear all filters
                  </button>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-3 gap-4">
                  {paginated.map(p => (
                    <ProductCard key={p.id} product={p} onView={() => navigate('product-detail')} />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {paginated.map(p => (
                    <ProductRow key={p.id} product={p} onView={() => navigate('product-detail')} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {paginated.length > 0 && (
                <Pagination page={page} total={displayTotal} pageSize={PAGE_SIZE} onChange={setPage} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
