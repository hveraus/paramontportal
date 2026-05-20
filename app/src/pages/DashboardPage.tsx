import { useMemo } from 'react'
import TopBar from '../components/TopBar'
import Sidebar from '../components/Sidebar'
import { useNavigation } from '../context/NavigationContext'
import { useLang } from '../context/LanguageContext'
import { MOCK_PRODUCTS } from '../mock/products'

// ── i18n copy ─────────────────────────────────────────────────────────────

const COPY = {
  en: {
    hero_title: 'Discover Our Products',
    hero_sub: 'The central hub for product management, development & brand collaboration.',
    hero_cta: 'Browse Products',
    hero_learn: 'Learn More →',
    hero_samples: 'Total Products',
    hero_projects: 'Active Projects',
    hero_brands: 'Brands',
    overview: 'Overview',
    total_samples: 'Total Products',
    new_month: 'New This Month',
    active_projects: 'Active Projects',
    pending_proposals: 'Pending Proposals',
    browse_category: 'Browse by Category',
    samples: 'products',
    our_brands: 'Our Brands',
    hot_products: 'Hot Products',
    views: 'views',
    my_workspace: 'My Workspace',
    recently_viewed: 'Recently Viewed',
    my_favorites: 'My Favorites',
    recently_updated: 'Recently Updated',
    view_all: 'View All',
    updated: 'Updated',
    no_items: 'No items yet',
  },
  zh: {
    hero_title: '探索我们的产品',
    hero_sub: '产品管理、开发与品牌协作的核心平台。',
    hero_cta: '浏览产品',
    hero_learn: '了解更多 →',
    hero_samples: '产品总数',
    hero_projects: '活跃项目',
    hero_brands: '合作品牌',
    overview: '数据概览',
    total_samples: '产品总数',
    new_month: '本月新增',
    active_projects: '活跃项目',
    pending_proposals: '待处理提案',
    browse_category: '按品类浏览',
    samples: '个产品',
    our_brands: '合作品牌',
    hot_products: '热门产品',
    views: '次浏览',
    my_workspace: '我的工作区',
    recently_viewed: '最近浏览',
    my_favorites: '我的收藏',
    recently_updated: '最近更新',
    view_all: '查看全部',
    updated: '更新于',
    no_items: '暂无内容',
  },
}

// ── Stats data ────────────────────────────────────────────────────────────

const STATS_DATA = [
  {
    key: 'total_samples' as const,
    value: '1,284',
    trend: '+12%',
    up: true,
    data: [40, 44, 42, 50, 48, 56, 54, 60, 66, 70],
    color: '#3b82f6',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11" />
      </svg>
    ),
  },
  {
    key: 'new_month' as const,
    value: '47',
    trend: '+8%',
    up: true,
    data: [8, 12, 9, 16, 12, 18, 15, 20, 17, 22],
    color: '#10b981',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    key: 'active_projects' as const,
    value: '23',
    trend: '-2%',
    up: false,
    data: [28, 26, 27, 25, 24, 26, 24, 25, 22, 23],
    color: '#f59e0b',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
      </svg>
    ),
  },
  {
    key: 'pending_proposals' as const,
    value: '8',
    trend: '+3',
    up: true,
    data: [2, 3, 4, 3, 5, 4, 6, 5, 7, 8],
    color: '#8b5cf6',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
]

// ── Category cards data ───────────────────────────────────────────────────

const CATEGORIES = [
  { name: { en: 'Crafts', zh: '手工艺' },         count: 312, image: `${import.meta.env.BASE_URL}Turtle.jpg` },
  { name: { en: 'Toys & Games', zh: '玩具游戏' },  count: 248, image: `${import.meta.env.BASE_URL}box.webp` },
  { name: { en: 'Art Supplies', zh: '美术用品' },  count: 186, image: `${import.meta.env.BASE_URL}Turtle.jpg` },
  { name: { en: 'Party & Seasonal', zh: '派对季节' }, count: 124, image: `${import.meta.env.BASE_URL}box.webp` },
  { name: { en: 'Stationery', zh: '文具' },        count: 198, image: `${import.meta.env.BASE_URL}Turtle.jpg` },
  { name: { en: 'Outdoor Toys', zh: '户外玩具' },  count: 89,  image: `${import.meta.env.BASE_URL}box.webp` },
  { name: { en: 'Educational', zh: '教育益智' },   count: 143, image: `${import.meta.env.BASE_URL}Turtle.jpg` },
  { name: { en: 'Holiday Décor', zh: '节日装饰' }, count: 76,  image: `${import.meta.env.BASE_URL}box.webp` },
]

// ── Brand data ────────────────────────────────────────────────────────────

const BRANDS = [
  { name: 'Paramont Global', logo: 'https://www.paramontgroup.com/assets/images/logo-paramont-global.png', bg: '#f0f4ff' },
  { name: 'WeVeel',          logo: 'https://www.paramontgroup.com/assets/images/logo-weveel.png',          bg: '#fff7ed' },
  { name: 'Evergreat',       logo: 'https://www.paramontgroup.com/assets/images/logo-evergreat.png',       bg: '#f0fdf4' },
  { name: 'Zhike',           logo: 'https://www.paramontgroup.com/assets/images/logo-zhike.png',           bg: '#fdf4ff' },
  { name: 'Scentos®',        logo: 'https://www.paramontgroup.com/assets/images/logo-scentos.png',         bg: '#fff1f2' },
  { name: 'Sugar Rush',      logo: 'https://www.paramontgroup.com/assets/images/logo-sugar-rush.png',      bg: '#fffbeb' },
  { name: 'YAY HOORAY!™',    logo: 'https://www.paramontgroup.com/assets/images/logo-yay-hooray.png',      bg: '#f0fdfa' },
]

// Mock favorites
const FAVORITE_IDS = ['p-01', 'p-07', 'p-04', 'p-12', 'p-02', 'p-08', 'p-11', 'p-05']

// ── Sparkline ─────────────────────────────────────────────────────────────

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const W = 88, H = 32
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / range) * (H - 4) - 2}`)
    .join(' ')
  const areaLast = `${(data.length - 1) / (data.length - 1) * W},${H} 0,${H}`
  return (
    <svg width={W} height={H} className="overflow-visible">
      <defs>
        <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${H - ((data[0] - min) / range) * (H - 4) - 2} ${pts} ${areaLast}`}
        fill={`url(#sg-${color.replace('#', '')})`}
      />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ── Section header ────────────────────────────────────────────────────────

function SectionHeader({ title, cta, onCta }: { title: string; cta?: string; onCta?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      {cta && (
        <button
          onClick={onCta}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          {cta} →
        </button>
      )}
    </div>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────

function StatCard({ label, value, trend, up, data, color, icon }: {
  label: string; value: string; trend: string; up: boolean
  data: number[]; color: string; icon: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
      {/* Top row: icon + label + trend */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}18` }}>
          <span style={{ color }}>{icon}</span>
        </div>
        <span className="text-sm font-medium text-slate-500 flex-1 leading-tight">{label}</span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0
          ${up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
          {up ? '↑' : '↓'} {trend}
        </span>
      </div>
      {/* Bottom row: number left, sparkline right */}
      <div className="flex items-end justify-between gap-3">
        <div className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">{value}</div>
        <Sparkline data={data} color={color} />
      </div>
    </div>
  )
}

// ── Category card ─────────────────────────────────────────────────────────

function CategoryCard({ name, count, image, label, onClick }: {
  name: string; count: number; image: string; label: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="group flex-shrink-0 w-40 rounded-2xl overflow-hidden border border-slate-200
                 bg-white shadow-sm hover:shadow-lg hover:border-blue-300 hover:-translate-y-0.5
                 transition-all duration-200 text-left"
    >
      <div className="relative h-32 overflow-hidden bg-slate-100">
        <img
          src={image} alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>
      <div className="px-3 py-2.5">
        <p className="text-sm font-semibold text-slate-800 truncate">{name}</p>
        <p className="text-xs text-slate-400 mt-0.5">{count} {label}</p>
      </div>
    </button>
  )
}

// ── Brand card ────────────────────────────────────────────────────────────

function BrandCard({ name, logo, bg }: { name: string; logo: string; bg: string }) {
  return (
    <div
      className="rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center
                 justify-center p-2 gap-1 hover:shadow-md hover:-translate-y-0.5
                 transition-all duration-200 cursor-pointer h-24"
      style={{ backgroundColor: bg }}
    >
      <img
        src={logo}
        alt={name}
        className="max-h-16 max-w-full object-contain"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none'
          const next = (e.target as HTMLImageElement).nextElementSibling as HTMLElement | null
          if (next) next.style.display = 'block'
        }}
      />
      <span className="hidden text-xs font-bold text-slate-600 text-center leading-tight">{name}</span>
    </div>
  )
}

// ── Status colour map (used by RecentRow) ────────────────────────────────

const STATUS_COLOR: Record<string, string> = {
  'Concept':        'bg-blue-50 text-blue-700 border border-blue-200',
  'Proposed':       'bg-violet-50 text-violet-700 border border-violet-200',
  'Pre-selected':   'bg-amber-50 text-amber-700 border border-amber-200',
  'Initial Sampled':'bg-orange-50 text-orange-700 border border-orange-200',
  'Production':     'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'Dropped':        'bg-slate-100 text-slate-500 border border-slate-200',
}

// ── Mini product row (workspace) ──────────────────────────────────────────

function MiniProductRow({ product, onClick }: {
  product: typeof MOCK_PRODUCTS[0]
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 hover:bg-slate-50 rounded-xl px-3 py-2.5
                 transition-colors text-left group"
    >
      <img src={product.image} alt={product.name}
        className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate group-hover:text-blue-700 transition-colors">
          {product.name}
        </p>
        <p className="text-xs text-slate-400 truncate mt-0.5">{product.subcategory}</p>
      </div>
      <span className="text-sm font-medium text-slate-800 flex-shrink-0">
        {product.retail !== null ? `$${product.retail.toFixed(2)}` : '—'}
      </span>
    </button>
  )
}

// ── Recently updated row ──────────────────────────────────────────────────


function RecentRow({ product, updatedLabel, onClick }: {
  product: typeof MOCK_PRODUCTS[0]
  updatedLabel: string
  onClick: () => void
}) {
  const date = new Date(product.updatedAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50
                 transition-colors text-left group"
    >
      <img src={product.image} alt={product.name}
        className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate group-hover:text-blue-700 transition-colors">
          {product.name}
        </p>
        <p className="text-xs text-slate-400 mt-0.5 font-mono">#{product.itemNo}</p>
      </div>
      <div className="hidden md:flex items-center gap-2 flex-shrink-0">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[product.status] ?? 'bg-slate-100 text-slate-500'}`}>
          {product.status}
        </span>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-medium text-slate-800">
          {product.retail !== null ? `$${product.retail.toFixed(2)}` : '—'}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">{updatedLabel} {date}</p>
      </div>
    </button>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { navigate } = useNavigation()
  const { lang } = useLang()
  const t = COPY[lang]

  const favorites = useMemo(() =>
    MOCK_PRODUCTS.filter(p => FAVORITE_IDS.includes(p.id)).slice(0, 8),
    []
  )

  const recentlyUpdated = useMemo(() =>
    [...MOCK_PRODUCTS]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 8),
    []
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar />

      <div className="flex">
        <Sidebar topOffset={56} />

        <main className="flex-1 min-w-0 overflow-x-hidden">

          {/* ── Hero ───────────────────────────────────────────────── */}
          <section className="relative overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #2e1065 100%)' }}>
            {/* Dot grid overlay */}
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />
            {/* Glow blobs */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between px-10 py-14">
              {/* Left: copy */}
              <div className="flex-1 max-w-xl">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm
                                rounded-full px-3.5 py-1.5 text-xs font-semibold text-blue-200 mb-6 border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  PDM System · v5
                </div>
                <h1 className="text-5xl font-extrabold leading-tight tracking-tight mb-4">
                  {t.hero_title}
                </h1>
                <p className="text-lg text-blue-100/70 mb-8 leading-relaxed max-w-md">
                  {t.hero_sub}
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => navigate('products')}
                    className="bg-white text-blue-900 font-bold px-6 py-3 rounded-xl
                               hover:bg-blue-50 transition-colors shadow-lg shadow-black/20 text-sm"
                  >
                    {t.hero_cta}
                  </button>
                  <button className="text-blue-200/80 hover:text-white text-sm font-medium transition-colors">
                    {t.hero_learn}
                  </button>
                </div>

                {/* Mini stats row */}
                <div className="flex items-center gap-8 mt-10 pt-8 border-t border-white/10">
                  {[
                    { value: '1,284', label: t.hero_samples },
                    { value: '23', label: t.hero_projects },
                    { value: '7', label: t.hero_brands },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-4">
                      {i > 0 && <div className="w-px h-8 bg-white/10" />}
                      <div>
                        <div className="text-2xl font-extrabold leading-none">{s.value}</div>
                        <div className="text-xs text-blue-200/60 mt-1">{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: product mosaic — right-aligned */}
              <div className="hidden lg:grid grid-cols-2 gap-3 flex-shrink-0 w-72 ml-auto">
                {[
                  { src: `${import.meta.env.BASE_URL}Turtle.jpg`,  mt: '0' },
                  { src: `${import.meta.env.BASE_URL}box.webp`,    mt: '24px' },
                  { src: `${import.meta.env.BASE_URL}box.webp`,    mt: '-16px' },
                  { src: `${import.meta.env.BASE_URL}Turtle.jpg`,  mt: '8px' },
                ].map((img, i) => (
                  <div
                    key={i}
                    className="rounded-2xl overflow-hidden aspect-square shadow-2xl ring-1"
                    style={{ marginTop: img.mt, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', outline: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <img src={img.src} className="w-full h-full object-cover" alt="" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="px-6 py-7 space-y-8">

            {/* ── Overview Stats ─────────────────────────────────── */}
            <section>
              <SectionHeader title={t.overview} />
              <div className="grid grid-cols-4 gap-4">
                {STATS_DATA.map(s => (
                  <StatCard
                    key={s.key}
                    label={t[s.key]}
                    value={s.value}
                    trend={s.trend}
                    up={s.up}
                    data={s.data}
                    color={s.color}
                    icon={s.icon}
                  />
                ))}
              </div>
            </section>

            {/* ── Browse by Category ─────────────────────────────── */}
            <section>
              <SectionHeader
                title={t.browse_category}
                cta={t.view_all}
                onCta={() => navigate('products')}
              />
              <div className="flex gap-4 overflow-x-auto pb-3"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#e2e8f0 transparent' }}>
                {CATEGORIES.map(cat => (
                  <CategoryCard
                    key={cat.name.en}
                    name={lang === 'en' ? cat.name.en : cat.name.zh}
                    count={cat.count}
                    image={cat.image}
                    label={t.samples}
                    onClick={() => navigate('products')}
                  />
                ))}
              </div>
            </section>

            {/* ── Our Brands ─────────────────────────────────────── */}
            <section>
              <SectionHeader title={t.our_brands} />
              <div className="grid grid-cols-7 gap-3">
                {BRANDS.map(b => (
                  <BrandCard key={b.name} name={b.name} logo={b.logo} bg={b.bg} />
                ))}
              </div>
            </section>

            {/* ── 2-col: Favorites + Recently Updated ─────────── */}
            <div className="grid grid-cols-2 gap-5">

              {/* My Favorites */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">{t.my_favorites}</h2>
                    <svg className="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <button
                    onClick={() => navigate('products')}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    {t.view_all} →
                  </button>
                </div>
                <div className="space-y-0.5">
                  {favorites.map(p => (
                    <MiniProductRow
                      key={p.id} product={p}
                      onClick={() => navigate('product-detail')}
                    />
                  ))}
                </div>
              </div>

              {/* Recently Updated */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                <SectionHeader
                  title={t.recently_updated}
                  cta={t.view_all}
                  onCta={() => navigate('products')}
                />
                <div className="divide-y divide-slate-50">
                  {recentlyUpdated.map(p => (
                    <RecentRow
                      key={p.id}
                      product={p}
                      updatedLabel={t.updated}
                      onClick={() => navigate('product-detail')}
                    />
                  ))}
                </div>
              </div>

            </div>

            <div className="h-6" />
          </div>
        </main>
      </div>
    </div>
  )
}
