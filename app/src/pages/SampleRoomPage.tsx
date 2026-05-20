import { useState, useMemo } from 'react'
import TopBar from '../components/TopBar'
import Sidebar from '../components/Sidebar'
import Breadcrumb from '../components/Breadcrumb'
import StatusTag from '../components/StatusTag'
import { useNavigation } from '../context/NavigationContext'
import { SAMPLE_SLOTS, type SampleSlot } from '../mock/sampleRoom'

// ── Status helpers ────────────────────────────────────────────────────────

const STATUS_VARIANT: Record<string, 'blue' | 'green' | 'red' | 'purple' | 'yellow' | 'orange' | 'gray'> = {
  'Concept':        'blue',
  'Proposed':       'purple',
  'Pre-selected':   'yellow',
  'Initial Sampled':'orange',
  'Production':     'green',
  'Dropped':        'gray',
}

// ── Grouping helper ───────────────────────────────────────────────────────

type ShelfGroup = { shelf: string; slots: SampleSlot[] }
type RoomGroup  = { room: string; shelves: ShelfGroup[] }

function groupSlots(slots: SampleSlot[]): RoomGroup[] {
  const map = new Map<string, Map<string, SampleSlot[]>>()
  for (const slot of slots) {
    if (!map.has(slot.room)) map.set(slot.room, new Map())
    const rm = map.get(slot.room)!
    if (!rm.has(slot.shelf)) rm.set(slot.shelf, [])
    rm.get(slot.shelf)!.push(slot)
  }
  return Array.from(map.entries()).map(([room, shelves]) => ({
    room,
    shelves: Array.from(shelves.entries()).map(([shelf, slots]) => ({ shelf, slots })),
  }))
}

// ── Icons ─────────────────────────────────────────────────────────────────

function IconChevron({ open }: { open: boolean }) {
  return (
    <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}
function IconX() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
function IconChevronRight() {
  return (
    <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}
function IconReset() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )
}

// ── Filter bar ────────────────────────────────────────────────────────────

interface Filters {
  room: string
  shelf: string
  position: string
  product: string
}

function FilterBar({
  filters,
  onChange,
  rooms,
  shelvesForRoom,
  onReset,
}: {
  filters: Filters
  onChange: (f: Partial<Filters>) => void
  rooms: string[]
  shelvesForRoom: string[]
  onReset: () => void
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Room */}
      <select
        value={filters.room}
        onChange={e => onChange({ room: e.target.value, shelf: '' })}
        className="h-9 pl-3 pr-8 text-sm rounded-lg border border-slate-200 bg-white text-slate-700
          focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '14px' }}
      >
        <option value="">All Rooms</option>
        {rooms.map(r => <option key={r} value={r}>{r}</option>)}
      </select>

      {/* Shelf */}
      <select
        value={filters.shelf}
        onChange={e => onChange({ shelf: e.target.value })}
        disabled={shelvesForRoom.length === 0}
        className="h-9 pl-3 pr-8 text-sm rounded-lg border border-slate-200 bg-white text-slate-700
          focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer
          disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '14px' }}
      >
        <option value="">All Shelves</option>
        {shelvesForRoom.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      {/* Position search */}
      <div className="relative">
        <input
          type="text"
          value={filters.position}
          onChange={e => onChange({ position: e.target.value })}
          placeholder="Position…"
          className="h-9 w-32 pl-3 pr-3 text-sm rounded-lg border border-slate-200 bg-white
            focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
        />
      </div>

      {/* Product search */}
      <div className="relative flex-1 min-w-44 max-w-64">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
        </svg>
        <input
          type="text"
          value={filters.product}
          onChange={e => onChange({ product: e.target.value })}
          placeholder="Search Item No or name…"
          className="h-9 w-full pl-9 pr-3 text-sm rounded-lg border border-slate-200 bg-white
            focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
        />
      </div>

      {/* Reset */}
      {(filters.room || filters.shelf || filters.position || filters.product) && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 h-9 px-3 text-sm rounded-lg
            border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
        >
          <IconReset />
          Reset
        </button>
      )}
    </div>
  )
}

// ── Slot row (list view) ──────────────────────────────────────────────────

function SlotRow({ slot, selected, onSelect }: {
  slot: SampleSlot
  selected: boolean
  onSelect: (s: SampleSlot) => void
}) {
  const { product } = slot
  if (!product) return null
  const variant = STATUS_VARIANT[product.status] ?? 'gray'

  return (
    <button
      onClick={() => onSelect(slot)}
      className={`w-full flex items-center gap-4 px-4 py-3 border-b border-slate-100 last:border-0
        text-left transition-colors group
        ${selected ? 'bg-blue-50' : 'hover:bg-slate-50/80'}`}
    >
      <span className="font-mono text-xs text-slate-400 w-20 flex-shrink-0">{slot.position}</span>
      <img
        src={product.thumbnail}
        alt={product.productName}
        className="w-9 h-9 rounded-lg object-cover flex-shrink-0 border border-slate-100"
        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
      />
      <div className="flex-1 min-w-0 flex items-center gap-3">
        <span className="font-mono text-xs text-slate-400 flex-shrink-0">{product.itemNo}</span>
        <span className="text-sm font-medium text-slate-800 truncate">{product.productName}</span>
      </div>
      <StatusTag label={product.status} variant={variant} dot={false} />
      <IconChevronRight />
    </button>
  )
}

// ── Shelf section ─────────────────────────────────────────────────────────

function ShelfSection({ shelfGroup, selectedId, onSelect, collapsed, onToggle }: {
  shelfGroup: ShelfGroup
  selectedId: string | null
  onSelect: (s: SampleSlot) => void
  collapsed: boolean
  onToggle: () => void
}) {
  const filled = shelfGroup.slots.filter(s => s.product).length
  const total  = shelfGroup.slots.length

  return (
    <div className="ml-4 mb-1">
      {/* Shelf header */}
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-3 py-2 w-full text-left hover:bg-slate-50 rounded-lg transition-colors group"
      >
        <span className={`transition-transform ${collapsed ? '' : 'rotate-90'}`}>
          <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </span>
        <span className="text-xs font-semibold text-slate-500">{shelfGroup.shelf}</span>
        <span className="text-[11px] text-slate-400 ml-1">{filled}/{total}</span>
      </button>

      {/* Slots */}
      {!collapsed && (
        <div className="ml-4 bg-white rounded-xl border border-slate-200 overflow-hidden">
          {shelfGroup.slots.map(slot => (
            <SlotRow
              key={slot.id}
              slot={slot}
              selected={selectedId === slot.id}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Room section ──────────────────────────────────────────────────────────

function RoomSection({ roomGroup, selectedId, onSelect, collapsedKeys, onToggle }: {
  roomGroup: RoomGroup
  selectedId: string | null
  onSelect: (s: SampleSlot) => void
  collapsedKeys: Set<string>
  onToggle: (key: string) => void
}) {
  const roomKey      = roomGroup.room
  const roomCollapsed = collapsedKeys.has(roomKey)
  const totalSamples = roomGroup.shelves.reduce((n, sg) => n + sg.slots.length, 0)

  return (
    <div className="mb-4">
      {/* Room header */}
      <button
        onClick={() => onToggle(roomKey)}
        className="flex items-center gap-2.5 w-full px-3 py-2.5 text-left rounded-xl
          bg-slate-800 hover:bg-slate-700 text-white transition-colors mb-2"
      >
        <IconChevron open={!roomCollapsed} />
        <span className="text-sm font-semibold">{roomGroup.room}</span>
        <span className="ml-auto text-xs text-slate-400 font-normal">{totalSamples} samples</span>
      </button>

      {!roomCollapsed && (
        <div>
          {roomGroup.shelves.map(sg => (
            <ShelfSection
              key={sg.shelf}
              shelfGroup={sg}
              selectedId={selectedId}
              onSelect={onSelect}
              collapsed={collapsedKeys.has(`${roomKey}::${sg.shelf}`)}
              onToggle={() => onToggle(`${roomKey}::${sg.shelf}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Product drawer ─────────────────────────────────────────────────────────

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-0.5">{label}</p>
      <p className="text-sm text-slate-700">
        {value || <span className="text-slate-300">—</span>}
      </p>
    </div>
  )
}

function ProductDrawer({ slot, onClose }: { slot: SampleSlot; onClose: () => void }) {
  const { navigate } = useNavigation()
  const { product }  = slot

  if (!product) return null

  const variant = STATUS_VARIANT[product.status] ?? 'gray'

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-x-0 top-[56px] bottom-0 z-40 bg-black/20 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="fixed right-0 top-[56px] bottom-0 z-50 w-[480px] bg-white border-l border-slate-200 shadow-2xl flex flex-col">

        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-base font-bold text-slate-900 leading-snug">{product.productName}</h2>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="font-mono text-xs text-slate-400">{product.itemNo}</span>
                <StatusTag label={product.status} variant={variant} />
              </div>
            </div>
            <button onClick={onClose} className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors mt-0.5">
              <IconX />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Product image */}
          <div className="flex justify-center">
            <img
              src={product.thumbnail}
              alt={product.productName}
              className="w-24 h-24 rounded-2xl object-cover border border-slate-200 shadow-sm"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          </div>

          {/* Location card */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-3">Location</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Room',     value: slot.room },
                { label: 'Shelf',    value: slot.shelf },
                { label: 'Position', value: slot.position },
              ].map(item => (
                <div key={item.label} className="bg-white rounded-lg border border-slate-200 px-3 py-2.5 text-center">
                  <p className="text-[9px] uppercase tracking-wider text-slate-400 mb-1">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-700 font-mono">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Basic info */}
          <div className="space-y-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Basic Info</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <Field label="Brand"    value={product.brand} />
              <Field label="Category" value={product.category} />
              <Field label="Responsible" value={product.responsiblePerson} />
              <Field label="Initial Selection"
                value={product.initialSelection
                  ? new Date(product.initialSelection).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                  : null}
              />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Description</p>
              <p className="text-sm text-slate-600 leading-relaxed">{product.itemDescription}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex-shrink-0">
          <button
            onClick={() => { navigate('product-detail'); onClose() }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
              bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            View full product details
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────

const DEFAULT_FILTERS: Filters = { room: '', shelf: '', position: '', product: '' }

export default function SampleRoomPage() {
  const [filters, setFilters]       = useState<Filters>(DEFAULT_FILTERS)
  const [selectedSlot, setSelected] = useState<SampleSlot | null>(null)
  const [collapsed, setCollapsed]   = useState<Set<string>>(new Set())

  // Derive room & shelf options from data
  const allRooms = useMemo(() => [...new Set(SAMPLE_SLOTS.map(s => s.room))].sort(), [])

  const shelvesForRoom = useMemo(() => {
    const base = filters.room
      ? SAMPLE_SLOTS.filter(s => s.room === filters.room)
      : SAMPLE_SLOTS
    return [...new Set(base.map(s => s.shelf))].sort()
  }, [filters.room])

  // Filter slots — only occupied positions
  const filteredSlots = useMemo(() => {
    return SAMPLE_SLOTS.filter(slot => {
      if (!slot.product) return false
      if (filters.room  && slot.room  !== filters.room)  return false
      if (filters.shelf && slot.shelf !== filters.shelf) return false
      if (filters.position) {
        if (!slot.position.toLowerCase().includes(filters.position.toLowerCase())) return false
      }
      if (filters.product) {
        const q = filters.product.toLowerCase()
        const matches =
          slot.product.itemNo.toLowerCase().includes(q) ||
          slot.product.productName.toLowerCase().includes(q)
        if (!matches) return false
      }
      return true
    })
  }, [filters])

  // Group for list view
  const grouped = useMemo(() => groupSlots(filteredSlots), [filteredSlots])

  // Stats
  const totalOccupied = SAMPLE_SLOTS.filter(s => s.product).length

  const handleFilterChange = (partial: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...partial }))
  }

  const toggleCollapsed = (key: string) => {
    setCollapsed(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <TopBar />

      <div className="flex">
        <Sidebar topOffset={56} />

        <div className="flex-1 min-w-0 px-6 py-5 space-y-4">

          {/* Breadcrumb */}
          <Breadcrumb crumbs={[
            { label: 'Home', href: '#' },
            { label: 'Sample Room' },
          ]} />

          {/* Page header */}
          <div>
            <h1 className="text-xl font-bold text-slate-900">Sample Room</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {totalOccupied} samples across {allRooms.length} rooms
            </p>
          </div>

          {/* Filter bar */}
          <FilterBar
            filters={filters}
            onChange={handleFilterChange}
            rooms={allRooms}
            shelvesForRoom={shelvesForRoom}
            onReset={() => setFilters(DEFAULT_FILTERS)}
          />

          {/* ── List view ── */}
          <div className="pb-8">
            {grouped.length === 0 ? (
              <EmptyState />
            ) : (
              grouped.map(rg => (
                <RoomSection
                  key={rg.room}
                  roomGroup={rg}
                  selectedId={selectedSlot?.id ?? null}
                  onSelect={setSelected}
                  collapsedKeys={collapsed}
                  onToggle={toggleCollapsed}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Drawer */}
      {selectedSlot?.product && (
        <ProductDrawer slot={selectedSlot} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-slate-400">
      <svg className="w-12 h-12 mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
      </svg>
      <p className="text-sm">No positions match your filters</p>
    </div>
  )
}
