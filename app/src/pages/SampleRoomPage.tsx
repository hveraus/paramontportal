import { useState, useCallback, useRef, useEffect } from 'react'
import TopBar from '../components/TopBar'
import Sidebar from '../components/Sidebar'
import StatusTag from '../components/StatusTag'
import { useNavigation } from '../context/NavigationContext'
import { LOCATION_NODES, MOCK_ASSIGNMENTS, DEFAULT_SCHEMA } from '../mock/sampleRoom'
import type { LocationNode, SampleAssignment, LocationSchema } from '../types'
import { MOCK_PRODUCTS } from '../mock/products'

// ── Status helpers ─────────────────────────────────────────────────────────

const STATUS_VARIANT: Record<string, 'blue' | 'green' | 'red' | 'purple' | 'yellow' | 'orange' | 'gray'> = {
  'Concept':        'blue',
  'Proposed':       'purple',
  'Pre-selected':   'yellow',
  'Initial Sampled':'orange',
  'Production':     'green',
  'Dropped':        'gray',
}

// ── Icons ──────────────────────────────────────────────────────────────────

function IcoChevron({ open, className = '' }: { open: boolean; className?: string }) {
  return (
    <svg className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-90' : ''} ${className}`}
      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}
function IcoX() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
function IcoPencil() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  )
}
function IcoTrash() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
}
function IcoPlus() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  )
}
function IcoSearch() {
  return (
    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
    </svg>
  )
}
function IcoGear() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

// ── Helpers ────────────────────────────────────────────────────────────────

// Build breadcrumb path for a node
function buildPath(nodeId: string, allNodes: LocationNode[]): LocationNode[] {
  const path: LocationNode[] = []
  let cur: LocationNode | undefined = allNodes.find(n => n.id === nodeId)
  while (cur) {
    path.unshift(cur)
    cur = cur.parentId ? allNodes.find(n => n.id === cur!.parentId) : undefined
  }
  return path
}

// Generate a new unique id prefix
let _counter = 100
function genId(prefix: string) { return `${prefix}-${++_counter}` }

// ── AssignDialog ──────────────────────────────────────────────────────────

function AssignDialog({
  positionId,
  nodes,
  onConfirm,
  onCancel,
}: {
  positionId: string
  nodes: LocationNode[]
  onConfirm: (productId: string, quantity: number, notes: string) => void
  onCancel: () => void
}) {
  const [search, setSearch] = useState('')
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')

  const path = buildPath(positionId, nodes)
  const pathLabel = path.map(n => n.name).join(' › ')

  const filtered = MOCK_PRODUCTS.filter(p => {
    if (!search) return true
    const q = search.toLowerCase()
    return p.name.toLowerCase().includes(q) || p.itemNo.toLowerCase().includes(q)
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-2xl shadow-2xl w-[520px] max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-start justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Assign Sample</h3>
            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[400px]">{pathLabel}</p>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
            <IcoX />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-slate-100">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"><IcoSearch /></div>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search product name or item#…"
              className="w-full h-9 pl-9 pr-3 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
              autoFocus
            />
          </div>
        </div>

        {/* Product list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-10">No products found</p>
          ) : (
            filtered.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedProductId(p.id)}
                className={`w-full flex items-center gap-3 px-6 py-3 border-b border-slate-50 text-left transition-colors
                  ${selectedProductId === p.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center
                  ${selectedProductId === p.id ? 'border-blue-600' : 'border-slate-300'}`}>
                  {selectedProductId === p.id && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{p.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-[11px] text-slate-400">{p.itemNo}</span>
                    <StatusTag label={p.status} variant={STATUS_VARIANT[p.status] ?? 'gray'} dot={false} />
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Quantity */}
        <div className="px-6 py-3 border-t border-slate-100">
          <label className="block text-xs font-medium text-slate-500 mb-1">Quantity</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={e => setQuantity(Math.max(1, Math.round(Number(e.target.value) || 1)))}
            className="w-28 h-9 px-3 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Notes */}
        <div className="px-6 py-3 border-t border-slate-100">
          <label className="block text-xs font-medium text-slate-500 mb-1">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={2}
            placeholder="e.g. For Q3 buyer review…"
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400 resize-none"
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => selectedProductId && onConfirm(selectedProductId, quantity, notes)}
            disabled={!selectedProductId}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Confirm Assignment
          </button>
        </div>
      </div>
    </div>
  )
}

// ── RemoveDialog ──────────────────────────────────────────────────────────

function RemoveDialog({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-2xl shadow-2xl w-[360px] p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-2">Remove Assignment</h3>
        <p className="text-sm text-slate-500 mb-5">This will free the position. The product record is not affected.</p>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}

// ── DeleteNodeDialog ──────────────────────────────────────────────────────

function DeleteNodeDialog({
  node,
  affectedAssignments,
  onConfirm,
  onCancel,
}: {
  node: LocationNode
  affectedAssignments: number
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-2xl shadow-2xl w-[400px] p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-2">Delete "{node.name}"?</h3>
        {affectedAssignments > 0 ? (
          <p className="text-sm text-red-600 mb-5">
            {affectedAssignments} sample{affectedAssignments !== 1 ? 's' : ''} will lose their location. This cannot be undone.
          </p>
        ) : (
          <p className="text-sm text-slate-500 mb-5">This location and all its sub-levels will be removed.</p>
        )}
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">
            Delete Anyway
          </button>
        </div>
      </div>
    </div>
  )
}

// ── BatchAddDialog ─────────────────────────────────────────────────────────

function BatchAddDialog({ onConfirm, onCancel }: { onConfirm: (count: number) => void; onCancel: () => void }) {
  const [count, setCount] = useState(4)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-2xl shadow-2xl w-[320px] p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Batch Add Positions</h3>
        <label className="block text-xs font-medium text-slate-500 mb-1.5">Number of positions to add</label>
        <input
          type="number"
          min={1}
          max={26}
          value={count}
          onChange={e => setCount(Math.max(1, Math.min(26, Number(e.target.value))))}
          className="w-full h-10 px-3 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <div className="flex gap-2 justify-end mt-5">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button onClick={() => onConfirm(count)} className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            Add {count} Positions
          </button>
        </div>
      </div>
    </div>
  )
}

// ── SchemaSettingsDialog ───────────────────────────────────────────────────

function SchemaSettingsDialog({
  schema,
  nodes,
  onSave,
  onCancel,
}: {
  schema: LocationSchema
  nodes: LocationNode[]
  onSave: (newSchema: LocationSchema) => void
  onCancel: () => void
}) {
  const [draft, setDraft] = useState<LocationSchema>(() => ({
    levels: schema.levels.map(l => ({ label: l.label })),
  }))

  const maxLevels = 8
  const minLevels = 1

  // Check if removing the last level would affect existing nodes
  const maxExistingDepth = nodes.length > 0 ? Math.max(...nodes.map(n => n.levelIndex)) : -1

  const canRemoveLevel = draft.levels.length > minLevels
  const removeBlocked = canRemoveLevel && maxExistingDepth >= draft.levels.length - 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-2xl shadow-2xl w-[440px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-start justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Level Settings</h3>
            <p className="text-xs text-slate-400 mt-0.5">Define your location hierarchy ({draft.levels.length} level{draft.levels.length !== 1 ? 's' : ''})</p>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
            <IcoX />
          </button>
        </div>

        {/* Level list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
          {draft.levels.map((level, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-slate-400 w-14 flex-shrink-0">Level {i + 1}</span>
              <input
                type="text"
                value={level.label}
                onChange={e => setDraft(prev => ({
                  levels: prev.levels.map((l, j) => j === i ? { label: e.target.value } : l),
                }))}
                className="flex-1 h-8 px-3 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Level ${i + 1} name…`}
              />
              {i === draft.levels.length - 1 && (
                <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full flex-shrink-0">Slot</span>
              )}
            </div>
          ))}
        </div>

        {/* Add / Remove level */}
        <div className="px-6 py-3 border-t border-slate-100 flex gap-2">
          <button
            disabled={draft.levels.length >= maxLevels}
            onClick={() => setDraft(prev => ({ levels: [...prev.levels, { label: `Level ${prev.levels.length + 1}` }] }))}
            className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <IcoPlus />Add a level
          </button>
          <button
            disabled={!canRemoveLevel}
            onClick={() => {
              if (removeBlocked) return
              setDraft(prev => ({ levels: prev.levels.slice(0, -1) }))
            }}
            className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors ml-2"
          >
            − Remove last level
          </button>
        </div>

        {/* Warning if nodes exist at level being removed */}
        {removeBlocked && (
          <div className="px-6 pb-3">
            <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
              ⚠ Nodes exist at the last level. Delete them first before removing this level.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onSave(draft)}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

// ── LocationTreeNode (Browse) ──────────────────────────────────────────────

function LocationTreeNode({
  node,
  nodes,
  assignments,
  selectedNodeId,
  expandedIds,
  onSelect,
  onToggle,
}: {
  node: LocationNode
  nodes: LocationNode[]
  assignments: SampleAssignment[]
  selectedNodeId: string | null
  expandedIds: Set<string>
  onSelect: (id: string) => void
  onToggle: (id: string) => void
}) {
  const children = nodes.filter(n => n.parentId === node.id).sort((a, b) => a.order - b.order)
  const isExpanded = expandedIds.has(node.id)
  const isSelected = selectedNodeId === node.id

  const indent = node.levelIndex * 12

  if (node.isLeaf) {
    const isOccupied = assignments.some(a => a.positionId === node.id)
    return (
      <button
        onClick={() => onSelect(node.id)}
        className={`w-full flex items-center gap-2 pr-3 py-1.5 text-left text-xs transition-colors rounded-md
          ${isSelected ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
        style={{ paddingLeft: `${indent + 8}px` }}
      >
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isOccupied ? 'bg-emerald-400' : 'bg-slate-300'}`} />
        <span className="truncate font-mono">{node.name}</span>
        {isOccupied && <span className="ml-auto text-[10px] text-emerald-600 font-medium">●</span>}
      </button>
    )
  }

  return (
    <div>
      <button
        onClick={() => { onToggle(node.id); onSelect(node.id) }}
        className={`w-full flex items-center gap-1.5 pr-3 py-1.5 text-left text-xs transition-colors rounded-md
          ${isSelected ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}
        style={{ paddingLeft: `${indent + 4}px` }}
      >
        <IcoChevron open={isExpanded} className={isSelected ? 'text-blue-500' : 'text-slate-400'} />
        <span className="font-medium truncate flex-1">{node.name}</span>
      </button>
      {isExpanded && (
        <div>
          {children.map(child => (
            <LocationTreeNode
              key={child.id}
              node={child}
              nodes={nodes}
              assignments={assignments}
              selectedNodeId={selectedNodeId}
              expandedIds={expandedIds}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── ManageTreeNode ─────────────────────────────────────────────────────────

function ManageTreeNode({
  node,
  nodes,
  assignments,
  expandedIds,
  editingNodeId,
  editingName,
  rootSchema,
  onToggle,
  onStartRename,
  onRenameChange,
  onRenameCommit,
  onRenameCancel,
  onDeleteRequest,
  onAddChild,
  onBatchAddRequest,
  onSchemaEdit,
}: {
  node: LocationNode
  nodes: LocationNode[]
  assignments: SampleAssignment[]
  expandedIds: Set<string>
  editingNodeId: string | null
  editingName: string
  rootSchema: LocationSchema
  onToggle: (id: string) => void
  onStartRename: (node: LocationNode) => void
  onRenameChange: (val: string) => void
  onRenameCommit: () => void
  onRenameCancel: () => void
  onDeleteRequest: (node: LocationNode) => void
  onAddChild: (parentId: string) => void
  onBatchAddRequest: (parentId: string) => void
  onSchemaEdit: (rootId: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const children = nodes.filter(n => n.parentId === node.id).sort((a, b) => a.order - b.order)
  const isExpanded = expandedIds.has(node.id)
  const isEditing = editingNodeId === node.id

  useEffect(() => {
    if (isEditing) inputRef.current?.focus()
  }, [isEditing])

  const isOccupied = node.isLeaf && assignments.some(a => a.positionId === node.id)

  const indent = node.levelIndex * 20
  const childLevelLabel = node.levelIndex < rootSchema.levels.length - 1
    ? (rootSchema.levels[node.levelIndex + 1]?.label ?? `Level ${node.levelIndex + 2}`)
    : null

  // Leaf: show assignment info
  const leafAssignment = node.isLeaf ? assignments.find(a => a.positionId === node.id) : null
  const leafProduct = leafAssignment ? MOCK_PRODUCTS.find(p => p.id === leafAssignment.productId) : null

  return (
    <div>
      <div
        className="group flex items-center gap-2 py-1.5 pr-2 rounded-lg hover:bg-slate-50 transition-colors"
        style={{ paddingLeft: `${indent + 8}px` }}
      >
        {/* Expand chevron */}
        {!node.isLeaf ? (
          <button onClick={() => onToggle(node.id)} className="text-slate-400 hover:text-slate-600 flex-shrink-0">
            <IcoChevron open={isExpanded} />
          </button>
        ) : (
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ml-0.5 ${isOccupied ? 'bg-emerald-400' : 'bg-slate-300'}`} />
        )}

        {/* Name / Edit input */}
        {isEditing ? (
          <input
            ref={inputRef}
            value={editingName}
            onChange={e => onRenameChange(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') onRenameCommit(); if (e.key === 'Escape') onRenameCancel() }}
            onBlur={onRenameCommit}
            className="flex-1 min-w-0 px-2 py-0.5 text-sm border border-blue-400 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        ) : (
          <span className="text-sm text-slate-700 font-medium truncate max-w-[280px]">{node.name}</span>
        )}

        {/* Leaf status — sits right next to the name */}
        {node.isLeaf && leafProduct && (
          <>
            <span className="text-[11px] text-emerald-700 truncate max-w-[180px]">{leafProduct.name}</span>
            {leafAssignment && (
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 rounded-full px-1.5 py-0.5 flex-shrink-0">×{leafAssignment.quantity}</span>
            )}
          </>
        )}
        {node.isLeaf && !leafProduct && (
          <span className="text-[11px] text-slate-400 italic">Empty</span>
        )}

        {/* Level settings gear — only for root nodes, always visible */}
        {node.parentId === null && (
          <button
            onClick={e => { e.stopPropagation(); onSchemaEdit(node.id) }}
            title="Level Settings"
            className="p-1 rounded text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0"
          >
            <IcoGear />
          </button>
        )}

        {/* Action buttons — always visible, subtle until hover */}
        {!isEditing && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <button
              onClick={() => onStartRename(node)}
              title="Rename"
              className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <IcoPencil />
            </button>
            <button
              onClick={() => onDeleteRequest(node)}
              title="Delete"
              className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <IcoTrash />
            </button>
            {childLevelLabel && !node.isLeaf && (
              <button
                onClick={() => onAddChild(node.id)}
                title={`Add ${childLevelLabel}`}
                className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <IcoPlus />
              </button>
            )}
            {node.levelIndex === rootSchema.levels.length - 2 && (
              <button
                onClick={() => onBatchAddRequest(node.id)}
                title="Batch add slots"
                className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                <IcoPlus />Batch
              </button>
            )}
          </div>
        )}
      </div>

      {/* Children */}
      {!node.isLeaf && isExpanded && (
        <div>
          {children.map(child => (
            <ManageTreeNode
              key={child.id}
              node={child}
              nodes={nodes}
              assignments={assignments}
              expandedIds={expandedIds}
              editingNodeId={editingNodeId}
              editingName={editingName}
              rootSchema={rootSchema}
              onToggle={onToggle}
              onStartRename={onStartRename}
              onRenameChange={onRenameChange}
              onRenameCommit={onRenameCommit}
              onRenameCancel={onRenameCancel}
              onDeleteRequest={onDeleteRequest}
              onAddChild={onAddChild}
              onBatchAddRequest={onBatchAddRequest}
              onSchemaEdit={onSchemaEdit}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── PositionDetail ─────────────────────────────────────────────────────────

function PositionDetail({
  node,
  nodes,
  assignment,
  onAssign,
  onRemove,
}: {
  node: LocationNode
  nodes: LocationNode[]
  assignment: SampleAssignment | null
  onAssign: () => void
  onRemove: () => void
}) {
  const { navigate } = useNavigation()
  const path = buildPath(node.id, nodes)
  const product = assignment ? MOCK_PRODUCTS.find(p => p.id === assignment.productId) : null

  return (
    <div className="max-w-lg mx-auto">
      {/* Breadcrumb path */}
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4 flex-wrap">
        {path.map((n, i) => (
          <span key={n.id} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-slate-300">›</span>}
            <span className={i === path.length - 1 ? 'text-slate-700 font-medium' : ''}>{n.name}</span>
          </span>
        ))}
      </div>

      {product && assignment ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Product header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img src={product.image} alt={product.name}
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-slate-900 leading-snug">{product.name}</h3>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="font-mono text-xs text-slate-400">{product.itemNo}</span>
                <StatusTag label={product.status} variant={STATUS_VARIANT[product.status] ?? 'gray'} />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="px-6 py-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Quantity</p>
              <p className="text-sm font-semibold text-slate-900">{assignment.quantity} <span className="text-slate-400 font-normal text-xs">pcs</span></p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Brand</p>
              <p className="text-sm text-slate-700">{product.brand}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Category</p>
              <p className="text-sm text-slate-700">{product.subcategory}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Assigned By</p>
              <p className="text-sm text-slate-700">{assignment.assignedBy}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Assigned At</p>
              <p className="text-sm text-slate-700">
                {new Date(assignment.assignedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </div>
            {assignment.notes && (
              <div className="col-span-2">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Notes</p>
                <p className="text-sm text-slate-600 italic">{assignment.notes}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-slate-100 flex gap-2">
            <button
              onClick={onRemove}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
            >
              Remove Sample
            </button>
            <button
              onClick={() => navigate('product-detail')}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              View Product
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Position is empty</p>
          <p className="text-xs text-slate-400 mb-5">{node.name} · {path.slice(0, -1).map(n => n.name).join(' › ')}</p>
          <button
            onClick={onAssign}
            className="px-5 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Assign a Sample
          </button>
        </div>
      )}
    </div>
  )
}

// ── NodeGrid (non-leaf selected in Browse) ─────────────────────────────────

function NodeGrid({
  node,
  nodes,
  assignments,
  onAssignPosition,
  onSelectPosition,
}: {
  node: LocationNode
  nodes: LocationNode[]
  assignments: SampleAssignment[]
  onAssignPosition: (positionId: string) => void
  onSelectPosition: (positionId: string) => void
}) {
  // Collect all descendant leaf nodes
  function subtreeLeaves(nid: string): LocationNode[] {
    const n = nodes.find(x => x.id === nid)
    if (!n) return []
    if (n.isLeaf) return [n]
    return nodes.filter(x => x.parentId === nid).sort((a, b) => a.order - b.order).flatMap(c => subtreeLeaves(c.id))
  }
  const leaves = subtreeLeaves(node.id)
  const path = buildPath(node.id, nodes)

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1 flex-wrap">
          {path.map((n, i) => (
            <span key={n.id} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-slate-300">›</span>}
              <span className={i === path.length - 1 ? 'text-slate-600 font-medium' : ''}>{n.name}</span>
            </span>
          ))}
        </div>
        <h2 className="text-lg font-bold text-slate-900">{node.name}</h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-3">
        {leaves.map(leaf => {
          const asgn = assignments.find(a => a.positionId === leaf.id)
          const product = asgn ? MOCK_PRODUCTS.find(p => p.id === asgn.productId) : null

          // Build path relative to the selected node (exclude the selected node itself)
          const fullPath = buildPath(leaf.id, nodes)
          const selectedIdx = fullPath.findIndex(n => n.id === node.id)
          const relativePath = selectedIdx >= 0 ? fullPath.slice(selectedIdx + 1) : fullPath
          const pathLabel = relativePath.map(n => n.name).join(' › ')

          if (product && asgn) {
            return (
              <button
                key={leaf.id}
                onClick={() => onSelectPosition(leaf.id)}
                className="bg-white rounded-xl border border-emerald-200 p-3 text-left shadow-sm hover:shadow-md hover:border-emerald-300 transition-all group"
              >
                <div className="flex items-start gap-2.5 mb-2">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex-shrink-0 overflow-hidden">
                    <img src={product.image} alt={product.name}
                      className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <StatusTag label={product.status} variant={STATUS_VARIANT[product.status] ?? 'gray'} dot={false} />
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 rounded-full px-1.5 py-0.5 flex-shrink-0">×{asgn.quantity}</span>
                    </div>
                    <p className="font-mono text-[10px] text-slate-400 mt-1.5">{product.itemNo}</p>
                  </div>
                </div>
                <p className="text-xs font-semibold text-slate-800 leading-tight line-clamp-2 mb-1.5">{product.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{pathLabel}</p>
              </button>
            )
          }

          return (
            <button
              key={leaf.id}
              onClick={() => onAssignPosition(leaf.id)}
              className="bg-white rounded-xl border-2 border-dashed border-slate-200 p-3 text-center
                hover:border-blue-300 hover:bg-blue-50/50 transition-all group min-h-[80px] flex flex-col items-center justify-center gap-1.5"
            >
              <span className="text-[10px] text-slate-400 truncate max-w-full px-1">{pathLabel}</span>
              <span className="text-[11px] text-slate-400 group-hover:text-blue-500 transition-colors">— Empty —</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function SampleRoomPage() {
  // ── State ──────────────────────────────────────────────────────────────
  const [viewMode, setViewMode] = useState<'browse' | 'manage'>('browse')
  // Per-root schemas: keyed by root node id
  const [schemas, setSchemas] = useState<Record<string, LocationSchema>>(() => {
    const init: Record<string, LocationSchema> = {}
    LOCATION_NODES.filter(n => n.parentId === null).forEach(root => {
      init[root.id] = DEFAULT_SCHEMA
    })
    return init
  })
  const [schemaDialog, setSchemaDialog] = useState<{ rootId: string } | null>(null)
  const [nodes, setNodes] = useState<LocationNode[]>(() => LOCATION_NODES)
  const [assignments, setAssignments] = useState<SampleAssignment[]>(() => MOCK_ASSIGNMENTS)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['zone-001']))

  // Browse dialogs
  const [assignDialog, setAssignDialog] = useState<{ positionId: string } | null>(null)
  const [removeDialog, setRemoveDialog] = useState<{ assignmentId: string } | null>(null)

  // Manage mode state
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [deleteDialog, setDeleteDialog] = useState<{ node: LocationNode } | null>(null)
  const [batchAddDialog, setBatchAddDialog] = useState<{ parentId: string } | null>(null)

  // ── Helpers ────────────────────────────────────────────────────────────

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const getRootId = useCallback((nodeId: string, allNodes: LocationNode[]): string => {
    let cur = allNodes.find(n => n.id === nodeId)
    while (cur && cur.parentId !== null) {
      cur = allNodes.find(n => n.id === cur!.parentId)
    }
    return cur?.id ?? nodeId
  }, [])

  // All descendant IDs (including self)
  const descendantIds = useCallback((nodeId: string, allNodes: LocationNode[]): string[] => {
    const children = allNodes.filter(n => n.parentId === nodeId)
    return [nodeId, ...children.flatMap(c => descendantIds(c.id, allNodes))]
  }, [])

  // ── CRUD operations ────────────────────────────────────────────────────

  const addAssignment = useCallback((positionId: string, productId: string, quantity: number, notes?: string) => {
    const newAsgn: SampleAssignment = {
      id: genId('asgn'),
      positionId,
      productId,
      quantity,
      assignedAt: new Date().toISOString().slice(0, 10),
      assignedBy: 'Sarah Thompson',
      notes: notes || undefined,
    }
    setAssignments(prev => [...prev, newAsgn])
  }, [])

  const removeAssignment = useCallback((assignmentId: string) => {
    setAssignments(prev => prev.filter(a => a.id !== assignmentId))
  }, [])

  const addNode = useCallback((parentId: string) => {
    const parent = nodes.find(n => n.id === parentId)
    if (!parent) return
    const rootId = getRootId(parentId, nodes)
    const rootSchema = schemas[rootId] ?? DEFAULT_SCHEMA
    const newLevelIndex = parent.levelIndex + 1
    const siblings = nodes.filter(n => n.parentId === parentId)
    const order = siblings.length + 1
    const isLeaf = newLevelIndex === rootSchema.levels.length - 1
    const newNode: LocationNode = {
      id: genId('node'),
      name: `${rootSchema.levels[newLevelIndex]?.label ?? `Level ${newLevelIndex + 1}`} ${order}`,
      levelIndex: newLevelIndex,
      parentId,
      order,
      isLeaf,
      createdAt: new Date().toISOString().slice(0, 10),
    }
    setNodes(prev => [...prev, newNode])
    setExpandedIds(prev => new Set([...prev, parentId]))
    // Auto-start rename
    setEditingNodeId(newNode.id)
    setEditingName(newNode.name)
  }, [nodes, schemas, getRootId])

  const renameNode = useCallback((nodeId: string, name: string) => {
    if (!name.trim()) return
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, name: name.trim() } : n))
  }, [])

  const deleteNode = useCallback((nodeId: string) => {
    const allIds = descendantIds(nodeId, nodes)
    setNodes(prev => prev.filter(n => !allIds.includes(n.id)))
    setAssignments(prev => prev.filter(a => !allIds.includes(a.positionId)))
    if (selectedNodeId && allIds.includes(selectedNodeId)) setSelectedNodeId(null)
  }, [nodes, descendantIds, selectedNodeId])

  const batchAddPositions = useCallback((parentId: string, count: number) => {
    const rootId = getRootId(parentId, nodes)
    const rootSchema = schemas[rootId] ?? DEFAULT_SCHEMA
    const existing = nodes.filter(n => n.parentId === parentId)
    const startOrder = existing.length + 1
    const newNodes: LocationNode[] = Array.from({ length: count }, (_, i) => {
      const num = startOrder + i
      // Use letter A–Z for name prefix based on existing count
      const letter = String.fromCharCode(65 + ((startOrder - 1 + i) % 26))
      return {
        id: genId('pos'),
        name: `${letter}-${num}`,
        levelIndex: rootSchema.levels.length - 1,
        parentId,
        order: num,
        isLeaf: true,
        createdAt: new Date().toISOString().slice(0, 10),
      }
    })
    setNodes(prev => [...prev, ...newNodes])
    setExpandedIds(prev => new Set([...prev, parentId]))
  }, [nodes, schemas, getRootId])

  // ── Derived values ─────────────────────────────────────────────────────

  const selectedNode = nodes.find(n => n.id === selectedNodeId) ?? null

  // ── Rename handlers ────────────────────────────────────────────────────

  const handleStartRename = (node: LocationNode) => {
    setEditingNodeId(node.id)
    setEditingName(node.name)
  }
  const handleRenameCommit = () => {
    if (editingNodeId) renameNode(editingNodeId, editingName)
    setEditingNodeId(null)
    setEditingName('')
  }
  const handleRenameCancel = () => {
    setEditingNodeId(null)
    setEditingName('')
  }

  // ── Delete handler ─────────────────────────────────────────────────────

  const handleDeleteRequest = (node: LocationNode) => {
    setDeleteDialog({ node })
  }
  const handleDeleteConfirm = () => {
    if (deleteDialog) deleteNode(deleteDialog.node.id)
    setDeleteDialog(null)
  }

  const handleSaveSchema = (rootId: string, newSchema: LocationSchema) => {
    setSchemas(prev => ({ ...prev, [rootId]: newSchema }))
    // Recompute isLeaf for all nodes in this subtree based on new schema depth
    const allIds = descendantIds(rootId, nodes)
    setNodes(prev => prev.map(n => {
      if (!allIds.includes(n.id)) return n
      return { ...n, isLeaf: n.levelIndex === newSchema.levels.length - 1 }
    }))
    setSchemaDialog(null)
  }

  // ── Assign/Remove handlers ─────────────────────────────────────────────

  const handleAssignConfirm = (productId: string, quantity: number, notes: string) => {
    if (assignDialog) addAssignment(assignDialog.positionId, productId, quantity, notes)
    setAssignDialog(null)
  }
  const handleRemoveConfirm = () => {
    if (removeDialog) removeAssignment(removeDialog.assignmentId)
    setRemoveDialog(null)
  }

  // Open remove dialog from PositionDetail
  const handlePositionRemove = () => {
    if (!selectedNodeId) return
    const asgn = assignments.find(a => a.positionId === selectedNodeId)
    if (asgn) setRemoveDialog({ assignmentId: asgn.id })
  }

  // ── Render ─────────────────────────────────────────────────────────────

  const roots = nodes.filter(n => n.parentId === null).sort((a, b) => a.order - b.order)

  // ── MANAGE MODE ────────────────────────────────────────────────────────
  if (viewMode === 'manage') {
    return (
      <div className="min-h-screen bg-white">
        <TopBar />
        <div className="flex" style={{ height: 'calc(100vh - 56px)' }}>
          <Sidebar topOffset={56} />
          <div className="flex-1 overflow-y-auto">
            {/* Sticky header */}
            <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewMode('browse')}
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Browse
                </button>
                <span className="text-slate-300">|</span>
                <h1 className="text-sm font-bold text-slate-900">Manage Locations</h1>
              </div>
              <button
                onClick={() => {
                  const order = nodes.filter(n => n.parentId === null).length + 1
                  const newRootId = genId('root')
                  // Default schema: 2 levels, user will configure immediately
                  const defaultSchema: LocationSchema = {
                    levels: [{ label: 'Level 1' }, { label: 'Slot' }],
                  }
                  const newNode: LocationNode = {
                    id: newRootId,
                    name: `Group ${String.fromCharCode(64 + order)}`,
                    levelIndex: 0,
                    parentId: null,
                    order,
                    isLeaf: false,  // schema has 2 levels, so root is not a leaf
                    createdAt: new Date().toISOString().slice(0, 10),
                  }
                  setNodes(prev => [...prev, newNode])
                  setSchemas(prev => ({ ...prev, [newRootId]: defaultSchema }))
                  setEditingNodeId(newNode.id)
                  setEditingName(newNode.name)
                  // Auto-open Level Settings for this new root
                  setSchemaDialog({ rootId: newRootId })
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <IcoPlus />
                Add Root Node
              </button>
            </div>

            {/* Tree editor */}
            <div className="px-6 py-4">
              {roots.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                  <p className="text-sm">No buildings yet. Click "Add Building" to get started.</p>
                </div>
              ) : (
                roots.map(node => (
                  <ManageTreeNode
                    key={node.id}
                    node={node}
                    nodes={nodes}
                    assignments={assignments}
                    expandedIds={expandedIds}
                    editingNodeId={editingNodeId}
                    editingName={editingName}
                    rootSchema={schemas[node.id] ?? DEFAULT_SCHEMA}
                    onToggle={toggleExpand}
                    onStartRename={handleStartRename}
                    onRenameChange={setEditingName}
                    onRenameCommit={handleRenameCommit}
                    onRenameCancel={handleRenameCancel}
                    onDeleteRequest={handleDeleteRequest}
                    onAddChild={addNode}
                    onBatchAddRequest={id => setBatchAddDialog({ parentId: id })}
                    onSchemaEdit={rootId => setSchemaDialog({ rootId })}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Dialogs */}
        {deleteDialog && (
          <DeleteNodeDialog
            node={deleteDialog.node}
            affectedAssignments={
              (() => {
                const ids = descendantIds(deleteDialog.node.id, nodes)
                return assignments.filter(a => ids.includes(a.positionId)).length
              })()
            }
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeleteDialog(null)}
          />
        )}
        {batchAddDialog && (
          <BatchAddDialog
            onConfirm={count => { batchAddPositions(batchAddDialog.parentId, count); setBatchAddDialog(null) }}
            onCancel={() => setBatchAddDialog(null)}
          />
        )}
        {schemaDialog && (
          <SchemaSettingsDialog
            schema={schemas[schemaDialog.rootId] ?? DEFAULT_SCHEMA}
            nodes={nodes.filter(n => {
              // Only pass nodes in this root's subtree for the "remove level" guard
              const allIds = descendantIds(schemaDialog.rootId, nodes)
              return allIds.includes(n.id)
            })}
            onSave={newSchema => handleSaveSchema(schemaDialog.rootId, newSchema)}
            onCancel={() => setSchemaDialog(null)}
          />
        )}
      </div>
    )
  }

  // ── BROWSE MODE ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar />
      <div className="flex" style={{ height: 'calc(100vh - 56px)' }}>
        <Sidebar topOffset={56} />

        {/* Left: location tree panel */}
        <div className="w-72 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
          {/* Panel header */}
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
            <h2 className="text-sm font-bold text-slate-900">Sample Room</h2>
            <button
              onClick={() => setViewMode('manage')}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              Manage Locations
            </button>
          </div>

          {/* Tree */}
          <div className="flex-1 overflow-y-auto py-2 px-2">
            {roots.map(node => (
              <LocationTreeNode
                key={node.id}
                node={node}
                nodes={nodes}
                assignments={assignments}
                selectedNodeId={selectedNodeId}
                expandedIds={expandedIds}
                onSelect={id => {
                  setSelectedNodeId(id)
                }}
                onToggle={toggleExpand}
              />
            ))}
          </div>
        </div>

        {/* Right: content panel */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
          {!selectedNode ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <svg className="w-12 h-12 mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-sm font-medium">Select a location</p>
              <p className="text-xs mt-1">Choose a node from the tree to view details</p>
            </div>
          ) : selectedNode.isLeaf ? (
            <PositionDetail
              node={selectedNode}
              nodes={nodes}
              assignment={assignments.find(a => a.positionId === selectedNode.id) ?? null}
              onAssign={() => setAssignDialog({ positionId: selectedNode.id })}
              onRemove={handlePositionRemove}
            />
          ) : (
            <NodeGrid
              node={selectedNode}
              nodes={nodes}
              assignments={assignments}
              onAssignPosition={positionId => setAssignDialog({ positionId })}
              onSelectPosition={positionId => setSelectedNodeId(positionId)}
            />
          )}
        </div>
      </div>

      {/* Dialogs */}
      {assignDialog && (
        <AssignDialog
          positionId={assignDialog.positionId}
          nodes={nodes}
          onConfirm={handleAssignConfirm}
          onCancel={() => setAssignDialog(null)}
        />
      )}
      {removeDialog && (
        <RemoveDialog
          onConfirm={handleRemoveConfirm}
          onCancel={() => setRemoveDialog(null)}
        />
      )}
    </div>
  )
}
