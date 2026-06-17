import { useState, useMemo } from 'react'
import TopBar from '../components/TopBar'
import Sidebar from '../components/Sidebar'
import { useNavigation } from '../context/NavigationContext'
import { MOCK_PRODUCTS, CATEGORY_TREE, HIERARCHY_TREE, type ProductListItem } from '../mock/products'

const PAGE_SIZE = 12
const TOTAL_RESULTS = 47 // simulated total

// ── Types ─────────────────────────────────────────────────────────────────

interface FilterState {
  categories: string[]
  hierarchies: string[]
  statuses: string[]
  brands: string[]
  everydaySeasonal: 'all' | 'Everyday' | 'Seasonal'
  holidays: string[]
  hasSample: boolean
  committed: boolean
}

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  hierarchies: [],
  statuses: [],
  brands: [],
  everydaySeasonal: 'all',
  holidays: [],
  hasSample: false,
  committed: false,
}

const ALL_BRANDS = [...new Set(MOCK_PRODUCTS.map(p => p.brand))].sort()
const ALL_HOLIDAYS = ['Halloween', 'Christmas', 'Easter', 'Thanksgiving', 'Other'] as const

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

function Checkbox({ label, checked, onChange, indeterminate = false, count, level = 1 }: {
  label: string; checked: boolean; onChange: () => void; indeterminate?: boolean; count?: number; level?: 1 | 2 | 3
}) {
  const labelCls =
    level === 1 ? 'text-sm font-medium text-slate-800 group-hover:text-slate-900' :
    level === 2 ? 'text-sm text-slate-600 group-hover:text-slate-800' :
                  'text-sm text-slate-500 group-hover:text-slate-700'
  const boxSz = 'w-4 h-4'
  return (
    <label className="flex items-center gap-2 py-0.5 cursor-pointer group flex-1 min-w-0">
      <div className={`${boxSz} rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors
        ${checked || indeterminate
          ? 'bg-blue-600 border-blue-600'
          : 'border-slate-300 group-hover:border-blue-400'}`}
        onClick={onChange}
      >
        {checked && <svg className="w-2 h-2 text-white" viewBox="0 0 10 10" fill="currentColor">
          <path d="M1.5 5.5L4 8l4.5-5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>}
        {indeterminate && <div className="w-1.5 h-0.5 bg-white rounded" />}
      </div>
      <span title={label} className={`flex-1 min-w-0 truncate transition-colors select-none leading-tight ${labelCls}`}>{label}</span>
      {count !== undefined && (
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full min-w-[18px] flex-shrink-0 text-center leading-none transition-colors
          ${checked || indeterminate
            ? 'bg-blue-100 text-blue-600'
            : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
          {count}
        </span>
      )}
    </label>
  )
}

// ── Toggle switch ─────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
                  transition-colors duration-200 focus:outline-none
                  ${checked ? 'bg-blue-600' : 'bg-slate-200'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200
                        ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  )
}

// ── Filter panel ──────────────────────────────────────────────────────────

function FilterPanel({ filters, onChange, categoryCounts, hierarchyCounts }: {
  filters: FilterState
  onChange: (f: FilterState) => void
  categoryCounts: Record<string, number>
  hierarchyCounts: Record<string, number>
}) {
  const { navigate } = useNavigation()
  const [expandedL1, setExpandedL1] = useState<Set<string>>(new Set())
  const [expandedHier, setExpandedHier] = useState<Set<string>>(new Set())

  const toggleExpL1 = (name: string) =>
    setExpandedL1(prev => { const s = new Set(prev); s.has(name) ? s.delete(name) : s.add(name); return s })
  const toggleExpHier = (name: string) =>
    setExpandedHier(prev => { const s = new Set(prev); s.has(name) ? s.delete(name) : s.add(name); return s })

  const toggleArr = (key: 'categories' | 'hierarchies' | 'statuses' | 'brands' | 'holidays', val: string) => {
    const arr = filters[key] as string[]
    onChange({ ...filters, [key]: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val] })
  }

  const toggleParentCat = (_parent: string, leaves: string[]) => {
    const allSelected = leaves.length > 0 && leaves.every(c => filters.categories.includes(c))
    const without = filters.categories.filter(c => !leaves.includes(c))
    onChange({ ...filters, categories: allSelected ? without : [...without, ...leaves] })
  }

  const toggleParentHier = (values: string[]) => {
    const allSelected = values.length > 0 && values.every(v => filters.hierarchies.includes(v))
    const without = filters.hierarchies.filter(v => !values.includes(v))
    onChange({ ...filters, hierarchies: allSelected ? without : [...without, ...values] })
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

      {/* ── 1. Category — 3 levels, collapsible ── */}
      <FilterSection title="Category">
        <div className="space-y-1">
          {CATEGORY_TREE.map(cat => {
            const leaves = cat.children
            const l1All  = leaves.length > 0 && leaves.every(c => filters.categories.includes(c))
            const l1Some = leaves.some(c => filters.categories.includes(c))
            const l1Count = leaves.reduce((s, c) => s + (categoryCounts[c] ?? 0), 0)
            const l1Open = expandedL1.has(cat.name)
            return (
              <div key={cat.name}>
                <div className="flex items-center gap-0.5 py-0.5">
                  <Checkbox
                    label={cat.name}
                    checked={l1All}
                    indeterminate={!l1All && l1Some}
                    onChange={() => toggleParentCat(cat.name, cat.children)}
                    count={l1Count || undefined}
                    level={1}
                  />
                  {leaves.length > 0 && (
                    <button onClick={() => toggleExpL1(cat.name)} className="ml-auto p-0.5 text-slate-400 hover:text-slate-600 flex-shrink-0">
                      <svg className={`w-3 h-3 transition-transform ${l1Open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                </div>
                {l1Open && leaves.length > 0 && (
                  <div className="ml-3 mt-0.5 mb-1 border-l-2 border-slate-100 pl-3 space-y-0">
                    {leaves.map(leaf => (
                      <Checkbox
                        key={leaf} label={leaf}
                        checked={filters.categories.includes(leaf)}
                        onChange={() => toggleArr('categories', leaf)}
                        count={categoryCounts[leaf] || undefined}
                        level={2}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </FilterSection>

      {/* ── Hierarchy — 2 levels, collapsible ── */}
      <FilterSection title="Hierarchy">
        <div className="space-y-1">
          {HIERARCHY_TREE.map(group => {
            const values = group.children.map(c => c.value)
            const all  = values.length > 0 && values.every(v => filters.hierarchies.includes(v))
            const some = values.some(v => filters.hierarchies.includes(v))
            const count = values.reduce((s, v) => s + (hierarchyCounts[v] ?? 0), 0)
            const open = expandedHier.has(group.name)
            return (
              <div key={group.name}>
                <div className="flex items-center gap-0.5 py-0.5">
                  <Checkbox
                    label={group.name}
                    checked={all}
                    indeterminate={!all && some}
                    onChange={() => toggleParentHier(values)}
                    count={count || undefined}
                    level={1}
                  />
                  <button onClick={() => toggleExpHier(group.name)} className="ml-auto p-0.5 text-slate-400 hover:text-slate-600 flex-shrink-0">
                    <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                {open && (
                  <div className="ml-3 mt-0.5 mb-1 border-l-2 border-slate-100 pl-3 space-y-0">
                    {group.children.map(leaf => (
                      <Checkbox
                        key={leaf.value} label={leaf.label}
                        checked={filters.hierarchies.includes(leaf.value)}
                        onChange={() => toggleArr('hierarchies', leaf.value)}
                        count={hierarchyCounts[leaf.value] || undefined}
                        level={2}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </FilterSection>

      {/* ── 2. Status ── */}
      <FilterSection title="Status">
        <div className="space-y-0.5">
          {(['Concept', 'Proposed', 'Pre-selected', 'Initial Sampled', 'Production', 'Dropped'] as const).map(s => (
            <Checkbox key={s} label={s}
              checked={filters.statuses.includes(s)}
              onChange={() => toggleArr('statuses', s)}
            />
          ))}
        </div>
      </FilterSection>

      {/* ── 3. Brand ── */}
      <FilterSection title="Brand">
        <div className="space-y-0.5">
          {ALL_BRANDS.map(b => (
            <Checkbox key={b} label={b}
              checked={filters.brands.includes(b)}
              onChange={() => toggleArr('brands', b)}
            />
          ))}
        </div>
      </FilterSection>

      {/* ── 4. Everyday / Seasonal ── */}
      <FilterSection title="Everyday / Seasonal">
        {/* Segmented selector */}
        <div className="flex rounded-lg border border-slate-200 overflow-hidden mb-2">
          {(['all', 'Everyday', 'Seasonal'] as const).map((opt, i) => (
            <button
              key={opt}
              onClick={() => onChange({ ...filters, everydaySeasonal: opt, holidays: [] })}
              className={`flex-1 py-1.5 text-xs font-medium transition-colors
                ${i > 0 ? 'border-l border-slate-200' : ''}
                ${filters.everydaySeasonal === opt
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              {opt === 'all' ? 'All' : opt}
            </button>
          ))}
        </div>
        {/* Holiday sub-options — only when Seasonal is selected */}
        {filters.everydaySeasonal === 'Seasonal' && (
          <div className="mt-2 ml-1 border-l-2 border-blue-100 pl-3 space-y-0.5">
            {ALL_HOLIDAYS.map(h => (
              <Checkbox key={h} label={h}
                checked={filters.holidays.includes(h)}
                onChange={() => toggleArr('holidays', h)}
                level={2}
              />
            ))}
          </div>
        )}
      </FilterSection>

      {/* ── 5. Has Sample ── */}
      <FilterSection title="In Sample Room">
        <div className="flex items-center justify-between py-1">
          <span className="text-sm text-slate-600">Has sample on display</span>
          <Toggle checked={filters.hasSample} onChange={() => onChange({ ...filters, hasSample: !filters.hasSample })} />
        </div>
      </FilterSection>

      {/* ── 6. Committed ── */}
      <FilterSection title="Committed">
        <div className="flex items-center justify-between py-1">
          <span className="text-sm text-slate-600">Committed only</span>
          <Toggle checked={filters.committed} onChange={() => onChange({ ...filters, committed: !filters.committed })} />
        </div>
      </FilterSection>

      {/* ── SOL Files entry ── */}
      <button
        onClick={() => navigate('sol-files')}
        className="mt-4 w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border border-slate-200
          bg-white text-slate-700 hover:bg-slate-50 hover:border-blue-300 transition-colors group"
      >
        <span className="inline-flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm font-medium">SOL Files</span>
        </span>
        <svg className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
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
        <p className="text-xs text-slate-400 font-mono mt-0.5">#{product.itemNo} · {product.category} / {product.subcategory} / {product.subsubcategory}</p>
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
    // Seed each subcategory with a deterministic mock count (1–9) so badges vary
    CATEGORY_TREE.forEach(cat => cat.children.forEach(leaf => {
      let h = 0
      for (let i = 0; i < leaf.length; i++) h = (h * 31 + leaf.charCodeAt(i)) >>> 0
      counts[leaf] = (h % 9) + 1
    }))
    // Real product matches add on top
    MOCK_PRODUCTS.forEach(p => {
      counts[p.subsubcategory] = (counts[p.subsubcategory] ?? 0) + 1
    })
    return counts
  }, [])

  const hierarchyCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    // Seed each hierarchy leaf with a deterministic mock count (1–9) so badges vary
    HIERARCHY_TREE.forEach(g => g.children.forEach(leaf => {
      let h = 0
      for (let i = 0; i < leaf.value.length; i++) h = (h * 31 + leaf.value.charCodeAt(i)) >>> 0
      counts[leaf.value] = (h % 9) + 1
    }))
    MOCK_PRODUCTS.forEach(p => {
      counts[p.hierarchy] = (counts[p.hierarchy] ?? 0) + 1
    })
    return counts
  }, [])

  const filtered = useMemo(() => {
    let list = [...MOCK_PRODUCTS]
    if (filters.categories.length)      list = list.filter(p => filters.categories.includes(p.subsubcategory))
    if (filters.hierarchies.length)     list = list.filter(p => filters.hierarchies.includes(p.hierarchy))
    if (filters.statuses.length)        list = list.filter(p => filters.statuses.includes(p.status))
    if (filters.brands.length)          list = list.filter(p => filters.brands.includes(p.brand))
    if (filters.everydaySeasonal !== 'all') list = list.filter(p => p.everydaySeasonal === filters.everydaySeasonal)
    if (filters.holidays.length)        list = list.filter(p => !!p.holiday && filters.holidays.includes(p.holiday))
    if (filters.hasSample)              list = list.filter(p => p.hasSample)
    if (filters.committed)              list = list.filter(p => p.committed)
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
  const hasActiveFilters = filters.categories.length > 0 || filters.hierarchies.length > 0 || filters.statuses.length > 0 ||
    filters.brands.length > 0 || filters.everydaySeasonal !== 'all' ||
    filters.holidays.length > 0 || filters.hasSample || filters.committed

  const displayTotal = hasActiveFilters ? sorted.length : TOTAL_RESULTS

  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const activeFilterCount = [
    filters.categories.length,
    filters.hierarchies.length,
    filters.statuses.length,
    filters.brands.length,
    filters.everydaySeasonal !== 'all' ? 1 : 0,
    filters.holidays.length,
    filters.hasSample ? 1 : 0,
    filters.committed ? 1 : 0,
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
            <FilterPanel filters={filters} onChange={(f) => { setFilters(f); setPage(1) }} categoryCounts={categoryCounts} hierarchyCounts={hierarchyCounts} />

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
