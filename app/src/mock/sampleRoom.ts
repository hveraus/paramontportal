import type { LocationNode, SampleAssignment, LocationSchema } from '../types'

// ── Default Schema ─────────────────────────────────────────────────────────
// 用户可在管理模式修改，这只是初始默认值

export const DEFAULT_SCHEMA: LocationSchema = {
  levels: [
    { label: 'Zone'  },   // levelIndex 0
    { label: 'Shelf' },   // levelIndex 1
    { label: 'Row'   },   // levelIndex 2
    { label: 'Slot'  },   // levelIndex 3 → isLeaf
  ],
}

// ── Location Nodes ─────────────────────────────────────────────────────────
// 4-level tree:
//   2 Zones → 2 Shelves each → 2 Rows each → 4 Slots each
//   Total leaves: 2×2×2×4 = 32 slots

export const LOCATION_NODES: LocationNode[] = [
  // Level 0: Zones
  { id: 'zone-001', name: 'Zone A', levelIndex: 0, parentId: null,       order: 1, isLeaf: false, createdAt: '2024-01-10' },
  { id: 'zone-002', name: 'Zone B', levelIndex: 0, parentId: null,       order: 2, isLeaf: false, createdAt: '2024-01-10' },

  // Level 1: Shelves under Zone A
  { id: 'shf-001', name: 'Shelf 1', levelIndex: 1, parentId: 'zone-001', order: 1, isLeaf: false, createdAt: '2024-01-15' },
  { id: 'shf-002', name: 'Shelf 2', levelIndex: 1, parentId: 'zone-001', order: 2, isLeaf: false, createdAt: '2024-01-15' },
  // Level 1: Shelves under Zone B
  { id: 'shf-003', name: 'Shelf 1', levelIndex: 1, parentId: 'zone-002', order: 1, isLeaf: false, createdAt: '2024-01-15' },
  { id: 'shf-004', name: 'Shelf 2', levelIndex: 1, parentId: 'zone-002', order: 2, isLeaf: false, createdAt: '2024-01-15' },

  // Level 2: Rows under shf-001
  { id: 'row-001', name: 'Row 1', levelIndex: 2, parentId: 'shf-001', order: 1, isLeaf: false, createdAt: '2024-01-20' },
  { id: 'row-002', name: 'Row 2', levelIndex: 2, parentId: 'shf-001', order: 2, isLeaf: false, createdAt: '2024-01-20' },
  // Level 2: Rows under shf-002
  { id: 'row-003', name: 'Row 1', levelIndex: 2, parentId: 'shf-002', order: 1, isLeaf: false, createdAt: '2024-01-20' },
  { id: 'row-004', name: 'Row 2', levelIndex: 2, parentId: 'shf-002', order: 2, isLeaf: false, createdAt: '2024-01-20' },
  // Level 2: Rows under shf-003
  { id: 'row-005', name: 'Row 1', levelIndex: 2, parentId: 'shf-003', order: 1, isLeaf: false, createdAt: '2024-01-20' },
  { id: 'row-006', name: 'Row 2', levelIndex: 2, parentId: 'shf-003', order: 2, isLeaf: false, createdAt: '2024-01-20' },
  // Level 2: Rows under shf-004
  { id: 'row-007', name: 'Row 1', levelIndex: 2, parentId: 'shf-004', order: 1, isLeaf: false, createdAt: '2024-01-20' },
  { id: 'row-008', name: 'Row 2', levelIndex: 2, parentId: 'shf-004', order: 2, isLeaf: false, createdAt: '2024-01-20' },

  // Level 3: Slots (isLeaf=true) — 4 per row, 8 rows = 32 total
  // row-001
  { id: 'slt-001', name: 'A1-1', levelIndex: 3, parentId: 'row-001', order: 1, isLeaf: true, createdAt: '2024-01-25' },
  { id: 'slt-002', name: 'A1-2', levelIndex: 3, parentId: 'row-001', order: 2, isLeaf: true, createdAt: '2024-01-25' },
  { id: 'slt-003', name: 'A1-3', levelIndex: 3, parentId: 'row-001', order: 3, isLeaf: true, createdAt: '2024-01-25' },
  { id: 'slt-004', name: 'A1-4', levelIndex: 3, parentId: 'row-001', order: 4, isLeaf: true, createdAt: '2024-01-25' },
  // row-002
  { id: 'slt-005', name: 'A2-1', levelIndex: 3, parentId: 'row-002', order: 1, isLeaf: true, createdAt: '2024-01-25' },
  { id: 'slt-006', name: 'A2-2', levelIndex: 3, parentId: 'row-002', order: 2, isLeaf: true, createdAt: '2024-01-25' },
  { id: 'slt-007', name: 'A2-3', levelIndex: 3, parentId: 'row-002', order: 3, isLeaf: true, createdAt: '2024-01-25' },
  { id: 'slt-008', name: 'A2-4', levelIndex: 3, parentId: 'row-002', order: 4, isLeaf: true, createdAt: '2024-01-25' },
  // row-003
  { id: 'slt-009', name: 'A3-1', levelIndex: 3, parentId: 'row-003', order: 1, isLeaf: true, createdAt: '2024-01-25' },
  { id: 'slt-010', name: 'A3-2', levelIndex: 3, parentId: 'row-003', order: 2, isLeaf: true, createdAt: '2024-01-25' },
  { id: 'slt-011', name: 'A3-3', levelIndex: 3, parentId: 'row-003', order: 3, isLeaf: true, createdAt: '2024-01-25' },
  { id: 'slt-012', name: 'A3-4', levelIndex: 3, parentId: 'row-003', order: 4, isLeaf: true, createdAt: '2024-01-25' },
  // row-004
  { id: 'slt-013', name: 'A4-1', levelIndex: 3, parentId: 'row-004', order: 1, isLeaf: true, createdAt: '2024-01-25' },
  { id: 'slt-014', name: 'A4-2', levelIndex: 3, parentId: 'row-004', order: 2, isLeaf: true, createdAt: '2024-01-25' },
  { id: 'slt-015', name: 'A4-3', levelIndex: 3, parentId: 'row-004', order: 3, isLeaf: true, createdAt: '2024-01-25' },
  { id: 'slt-016', name: 'A4-4', levelIndex: 3, parentId: 'row-004', order: 4, isLeaf: true, createdAt: '2024-01-25' },
  // row-005
  { id: 'slt-017', name: 'B1-1', levelIndex: 3, parentId: 'row-005', order: 1, isLeaf: true, createdAt: '2024-01-25' },
  { id: 'slt-018', name: 'B1-2', levelIndex: 3, parentId: 'row-005', order: 2, isLeaf: true, createdAt: '2024-01-25' },
  { id: 'slt-019', name: 'B1-3', levelIndex: 3, parentId: 'row-005', order: 3, isLeaf: true, createdAt: '2024-01-25' },
  { id: 'slt-020', name: 'B1-4', levelIndex: 3, parentId: 'row-005', order: 4, isLeaf: true, createdAt: '2024-01-25' },
  // row-006
  { id: 'slt-021', name: 'B2-1', levelIndex: 3, parentId: 'row-006', order: 1, isLeaf: true, createdAt: '2024-01-25' },
  { id: 'slt-022', name: 'B2-2', levelIndex: 3, parentId: 'row-006', order: 2, isLeaf: true, createdAt: '2024-01-25' },
  { id: 'slt-023', name: 'B2-3', levelIndex: 3, parentId: 'row-006', order: 3, isLeaf: true, createdAt: '2024-01-25' },
  { id: 'slt-024', name: 'B2-4', levelIndex: 3, parentId: 'row-006', order: 4, isLeaf: true, createdAt: '2024-01-25' },
  // row-007
  { id: 'slt-025', name: 'B3-1', levelIndex: 3, parentId: 'row-007', order: 1, isLeaf: true, createdAt: '2024-01-25' },
  { id: 'slt-026', name: 'B3-2', levelIndex: 3, parentId: 'row-007', order: 2, isLeaf: true, createdAt: '2024-01-25' },
  { id: 'slt-027', name: 'B3-3', levelIndex: 3, parentId: 'row-007', order: 3, isLeaf: true, createdAt: '2024-01-25' },
  { id: 'slt-028', name: 'B3-4', levelIndex: 3, parentId: 'row-007', order: 4, isLeaf: true, createdAt: '2024-01-25' },
  // row-008
  { id: 'slt-029', name: 'B4-1', levelIndex: 3, parentId: 'row-008', order: 1, isLeaf: true, createdAt: '2024-01-25' },
  { id: 'slt-030', name: 'B4-2', levelIndex: 3, parentId: 'row-008', order: 2, isLeaf: true, createdAt: '2024-01-25' },
  { id: 'slt-031', name: 'B4-3', levelIndex: 3, parentId: 'row-008', order: 3, isLeaf: true, createdAt: '2024-01-25' },
  { id: 'slt-032', name: 'B4-4', levelIndex: 3, parentId: 'row-008', order: 4, isLeaf: true, createdAt: '2024-01-25' },
]

// ── Assignments (~20 of 32 slots occupied) ─────────────────────────────────
export const MOCK_ASSIGNMENTS: SampleAssignment[] = [
  // Zone A / Shelf 1 / Row 1
  { id: 'asgn-001', positionId: 'slt-001', productId: 'p-01', quantity: 3, assignedAt: '2024-09-10', assignedBy: 'Sarah Thompson', notes: 'Q4 range review' },
  { id: 'asgn-002', positionId: 'slt-002', productId: 'p-02', quantity: 5, assignedAt: '2024-10-05', assignedBy: 'Summer Li' },
  { id: 'asgn-003', positionId: 'slt-003', productId: 'p-03', quantity: 2, assignedAt: '2024-10-18', assignedBy: 'Sarah Thompson' },
  // slt-004 empty
  // Zone A / Shelf 1 / Row 2
  { id: 'asgn-004', positionId: 'slt-005', productId: 'p-04', quantity: 4, assignedAt: '2024-11-01', assignedBy: 'Summer Li', notes: 'Pending QC sign-off' },
  { id: 'asgn-005', positionId: 'slt-006', productId: 'p-05', quantity: 6, assignedAt: '2024-11-15', assignedBy: 'Sarah Thompson' },
  // slt-007, slt-008 empty
  // Zone A / Shelf 2 / Row 1
  { id: 'asgn-006', positionId: 'slt-009', productId: 'p-06', quantity: 1, assignedAt: '2024-08-20', assignedBy: 'Summer Li' },
  { id: 'asgn-007', positionId: 'slt-010', productId: 'p-07', quantity: 8, assignedAt: '2024-09-30', assignedBy: 'Sarah Thompson', notes: 'WMT buyer preview' },
  { id: 'asgn-008', positionId: 'slt-011', productId: 'p-08', quantity: 3, assignedAt: '2024-10-12', assignedBy: 'Summer Li' },
  // slt-012 empty
  // Zone A / Shelf 2 / Row 2
  { id: 'asgn-009', positionId: 'slt-013', productId: 'p-09', quantity: 5, assignedAt: '2024-09-22', assignedBy: 'Sarah Thompson' },
  { id: 'asgn-010', positionId: 'slt-014', productId: 'p-10', quantity: 2, assignedAt: '2024-11-03', assignedBy: 'Summer Li' },
  // slt-015, slt-016 empty
  // Zone B / Shelf 1 / Row 1
  { id: 'asgn-011', positionId: 'slt-017', productId: 'p-11', quantity: 4, assignedAt: '2024-10-08', assignedBy: 'Sarah Thompson' },
  { id: 'asgn-012', positionId: 'slt-018', productId: 'p-12', quantity: 6, assignedAt: '2024-10-25', assignedBy: 'Summer Li', notes: 'Strategy game prototype' },
  // slt-019, slt-020 empty
  // Zone B / Shelf 1 / Row 2
  { id: 'asgn-013', positionId: 'slt-021', productId: 'p-01', quantity: 3, assignedAt: '2025-01-08', assignedBy: 'Sarah Thompson' },
  { id: 'asgn-014', positionId: 'slt-022', productId: 'p-02', quantity: 5, assignedAt: '2025-01-20', assignedBy: 'Summer Li' },
  // slt-023, slt-024 empty
  // Zone B / Shelf 2 / Row 1
  { id: 'asgn-015', positionId: 'slt-025', productId: 'p-03', quantity: 2, assignedAt: '2025-02-05', assignedBy: 'Sarah Thompson' },
  { id: 'asgn-016', positionId: 'slt-026', productId: 'p-04', quantity: 4, assignedAt: '2025-02-14', assignedBy: 'Summer Li', notes: 'TGT line review' },
  { id: 'asgn-017', positionId: 'slt-027', productId: 'p-05', quantity: 6, assignedAt: '2025-02-28', assignedBy: 'Sarah Thompson' },
  // slt-028 empty
  // Zone B / Shelf 2 / Row 2 — all empty (slt-029 through slt-032)
]
