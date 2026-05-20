import type { ProductStatus } from '../types'

// ── Types ─────────────────────────────────────────────────────────────────

export interface SampleProduct {
  itemNo: string
  productName: string
  thumbnail: string
  status: ProductStatus
  brand: string
  category: string
  responsiblePerson: string
  initialSelection: string | null   // ISO date or null
  itemDescription: string
}

export interface SampleSlot {
  id: string
  room: string
  shelf: string
  position: string
  product: SampleProduct | null
}

// ── Data ──────────────────────────────────────────────────────────────────

export const SAMPLE_SLOTS: SampleSlot[] = [
  // ── Room A · Shelf 1 ─────────────────────────────────────────────────
  {
    id: 'sl-001', room: 'Room A', shelf: 'Shelf 1', position: 'A-01-01',
    product: {
      itemNo: 'PM-YN-024', productName: 'WMT Chunky Yarn Pack 3-colour',
      thumbnail: 'https://placehold.co/80x80/e879f9/ffffff?text=YN',
      status: 'Production',
      brand: 'Paramont Basics', category: 'Crafts / Yarn',
      responsiblePerson: 'Xiaomei Li', initialSelection: '2024-09-15',
      itemDescription: '3-colour chunky yarn pack, 100g per ball. Suitable for beginners and advanced knitters. Machine washable.',
    },
  },
  {
    id: 'sl-002', room: 'Room A', shelf: 'Shelf 1', position: 'A-01-02',
    product: {
      itemNo: 'PM-WC-088', productName: 'TGT Watercolour Set 24-pan',
      thumbnail: 'https://placehold.co/80x80/60a5fa/ffffff?text=WC',
      status: 'Pre-selected',
      brand: 'ArtFlow', category: 'Art Supplies / Paints',
      responsiblePerson: 'Sarah Thompson', initialSelection: '2025-01-08',
      itemDescription: '24-pan watercolour set with professional-grade pigments. Includes mixing palette and 2 brushes. AP certified.',
    },
  },
  {
    id: 'sl-003', room: 'Room A', shelf: 'Shelf 1', position: 'A-01-03',
    product: {
      itemNo: 'PM-CK-015', productName: 'DT Mini Craft Kit Assortment',
      thumbnail: 'https://placehold.co/80x80/4ade80/ffffff?text=CK',
      status: 'Initial Sampled',
      brand: 'Kiddocraft', category: 'Crafts / Craft Kits',
      responsiblePerson: 'Wei Zhang', initialSelection: '2025-02-20',
      itemDescription: 'All-in-one mini craft kit with foam shapes, googly eyes, glue stick, and construction paper. Age 4+.',
    },
  },
  {
    id: 'sl-004', room: 'Room A', shelf: 'Shelf 1', position: 'A-01-04',
    product: {
      itemNo: 'PM-GG-033', productName: 'FBW Glitter Glue 3pc Set',
      thumbnail: 'https://placehold.co/80x80/a78bfa/ffffff?text=GG',
      status: 'Proposed',
      brand: 'Sparkle Studio', category: 'Crafts / Adhesives',
      responsiblePerson: 'Wei Zhang', initialSelection: null,
      itemDescription: 'Set of 3 glitter glue pens in gold, silver, and rainbow. Non-toxic, washable formula. 20ml each.',
    },
  },
  { id: 'sl-005', room: 'Room A', shelf: 'Shelf 1', position: 'A-01-05', product: null },

  // ── Room A · Shelf 2 ─────────────────────────────────────────────────
  {
    id: 'sl-006', room: 'Room A', shelf: 'Shelf 2', position: 'A-02-01',
    product: {
      itemNo: 'PM-AP-112', productName: 'WMT Acrylic Paint Set 24ct',
      thumbnail: 'https://placehold.co/80x80/fb923c/ffffff?text=AP',
      status: 'Production',
      brand: 'ColorPro', category: 'Art Supplies / Paints',
      responsiblePerson: 'Sarah Thompson', initialSelection: '2024-08-10',
      itemDescription: '24-colour acrylic paint set, 12ml tubes. Heavy body, lightfast pigments. Suitable for canvas, wood, and fabric. ASTM certified.',
    },
  },
  {
    id: 'sl-007', room: 'Room A', shelf: 'Shelf 2', position: 'A-02-02',
    product: {
      itemNo: 'PM-SK-041', productName: 'TGT Sketchpad A4 50-sheet',
      thumbnail: 'https://placehold.co/80x80/94a3b8/ffffff?text=SK',
      status: 'Concept',
      brand: 'DrawRight', category: 'Art Supplies / Paper',
      responsiblePerson: 'James Park', initialSelection: null,
      itemDescription: '50-sheet A4 sketchpad, 160gsm acid-free cartridge paper. Spiral bound. Suitable for pencil, charcoal, and light wash.',
    },
  },
  { id: 'sl-008', room: 'Room A', shelf: 'Shelf 2', position: 'A-02-03', product: null },
  {
    id: 'sl-009', room: 'Room A', shelf: 'Shelf 2', position: 'A-02-04',
    product: {
      itemNo: 'PM-FB-005', productName: 'DT Foam Brush Set 5pc',
      thumbnail: 'https://placehold.co/80x80/fbbf24/1f2937?text=FB',
      status: 'Initial Sampled',
      brand: 'BrushMate', category: 'Art Supplies / Tools',
      responsiblePerson: 'Xiaomei Li', initialSelection: '2025-01-25',
      itemDescription: '5-piece foam brush set in assorted sizes (1", 1.5", 2", 2.5", 3"). Ideal for staining, varnishing, and applying gesso.',
    },
  },
  {
    id: 'sl-010', room: 'Room A', shelf: 'Shelf 2', position: 'A-02-05',
    product: {
      itemNo: 'PM-SA-007', productName: 'FBW Sand Art Kit',
      thumbnail: 'https://placehold.co/80x80/fde047/1f2937?text=SA',
      status: 'Pre-selected',
      brand: 'Kiddocraft', category: 'Crafts / Craft Kits',
      responsiblePerson: 'Wei Zhang', initialSelection: '2025-02-01',
      itemDescription: 'Sand art kit with 6 pre-printed boards, 10 colour sand vials, and applicator tool. Age 5+. No-mess design.',
    },
  },

  // ── Room A · Shelf 3 ─────────────────────────────────────────────────
  {
    id: 'sl-011', room: 'Room A', shelf: 'Shelf 3', position: 'A-03-01',
    product: {
      itemNo: 'PM-NB-023', productName: 'WMT Linen Hardcover Notebook A5',
      thumbnail: 'https://placehold.co/80x80/818cf8/ffffff?text=NB',
      status: 'Production',
      brand: 'Paramont Basics', category: 'Stationery / Notebooks',
      responsiblePerson: 'Sarah Thompson', initialSelection: '2024-07-20',
      itemDescription: 'A5 hardcover notebook with linen cover, 192 ruled pages. Elastic closure, ribbon bookmark, and expandable pocket.',
    },
  },
  {
    id: 'sl-012', room: 'Room A', shelf: 'Shelf 3', position: 'A-03-02',
    product: {
      itemNo: 'PM-YN-041', productName: 'TGT Chunky Merino Blend 200g',
      thumbnail: 'https://placehold.co/80x80/f472b6/ffffff?text=YN',
      status: 'Proposed',
      brand: 'WoolHouse', category: 'Crafts / Yarn',
      responsiblePerson: 'Xiaomei Li', initialSelection: null,
      itemDescription: '200g chunky merino blend yarn, 80m. Machine washable. Available in 12 seasonal colourways for Q3 2025.',
    },
  },
  { id: 'sl-013', room: 'Room A', shelf: 'Shelf 3', position: 'A-03-03', product: null },
  {
    id: 'sl-014', room: 'Room A', shelf: 'Shelf 3', position: 'A-03-04',
    product: {
      itemNo: 'PM-DW-019', productName: 'DT Kids Drawing Set 18pc',
      thumbnail: 'https://placehold.co/80x80/fb7185/ffffff?text=DW',
      status: 'Initial Sampled',
      brand: 'Kiddocraft', category: 'Art Supplies / Drawing',
      responsiblePerson: 'James Park', initialSelection: '2025-03-01',
      itemDescription: '18-piece kids drawing set: 6 crayons, 6 coloured pencils, and 6 washable markers in a zip case. AP certified, age 3+.',
    },
  },

  // ── Room B · Shelf 1 ─────────────────────────────────────────────────
  {
    id: 'sl-015', room: 'Room B', shelf: 'Shelf 1', position: 'B-01-01',
    product: {
      itemNo: 'PM-CB-067', productName: 'WMT Canvas Board 8×10 3pk',
      thumbnail: 'https://placehold.co/80x80/22d3ee/ffffff?text=CB',
      status: 'Pre-selected',
      brand: 'ArtFlow', category: 'Art Supplies / Canvas',
      responsiblePerson: 'Sarah Thompson', initialSelection: '2025-01-15',
      itemDescription: 'Pack of 3 primed cotton canvas boards, 8×10 inch. Double-primed for acrylic and oil. Sturdy 3mm MDF backing.',
    },
  },
  {
    id: 'sl-016', room: 'Room B', shelf: 'Shelf 1', position: 'B-01-02',
    product: {
      itemNo: 'PM-SC-014', productName: 'TGT Craft Scissors Value Set',
      thumbnail: 'https://placehold.co/80x80/f87171/ffffff?text=SC',
      status: 'Concept',
      brand: 'SharpEdge', category: 'Crafts / Tools',
      responsiblePerson: 'James Park', initialSelection: null,
      itemDescription: 'Set of 5 craft scissors in assorted sizes, including decorative-edge patterns. Stainless steel blades, comfort-grip handles.',
    },
  },
  {
    id: 'sl-017', room: 'Room B', shelf: 'Shelf 1', position: 'B-01-03',
    product: {
      itemNo: 'PM-WT-022', productName: 'FBW Washi Tape Set 10-roll',
      thumbnail: 'https://placehold.co/80x80/2dd4bf/ffffff?text=WT',
      status: 'Pre-selected',
      brand: 'Sparkle Studio', category: 'Crafts / Paper Craft',
      responsiblePerson: 'Wei Zhang', initialSelection: '2025-02-10',
      itemDescription: '10-roll washi tape set in assorted seasonal patterns. 15mm wide, 10m per roll. Repositionable, acid-free.',
    },
  },
  { id: 'sl-018', room: 'Room B', shelf: 'Shelf 1', position: 'B-01-04', product: null },
  {
    id: 'sl-019', room: 'Room B', shelf: 'Shelf 1', position: 'B-01-05',
    product: {
      itemNo: 'PM-BK-091', productName: 'DT Brush Pen Set 12ct',
      thumbnail: 'https://placehold.co/80x80/c084fc/ffffff?text=BK',
      status: 'Proposed',
      brand: 'ColorPro', category: 'Art Supplies / Pens',
      responsiblePerson: 'Xiaomei Li', initialSelection: null,
      itemDescription: '12-colour flexible brush pen set. Water-based, blendable ink. Dual tip: brush and fine 0.4mm. Ideal for lettering and illustration.',
    },
  },

  // ── Room B · Shelf 2 ─────────────────────────────────────────────────
  {
    id: 'sl-020', room: 'Room B', shelf: 'Shelf 2', position: 'B-02-01',
    product: {
      itemNo: 'PM-CK-088', productName: 'WMT Holiday Craft Kit Deluxe',
      thumbnail: 'https://placehold.co/80x80/ef4444/ffffff?text=HK',
      status: 'Initial Sampled',
      brand: 'Kiddocraft', category: 'Party & Seasonal / Holiday',
      responsiblePerson: 'Sarah Thompson', initialSelection: '2025-03-12',
      itemDescription: 'Deluxe holiday craft kit with 50+ pieces: foam ornaments, glitter, pipe cleaners, ribbon, and adhesive gems. Age 5+.',
    },
  },
  { id: 'sl-021', room: 'Room B', shelf: 'Shelf 2', position: 'B-02-02', product: null },
  {
    id: 'sl-022', room: 'Room B', shelf: 'Shelf 2', position: 'B-02-03',
    product: {
      itemNo: 'PM-PS-036', productName: 'TGT Oil Pastel Set 36ct',
      thumbnail: 'https://placehold.co/80x80/a3e635/1f2937?text=PS',
      status: 'Proposed',
      brand: 'ColorPro', category: 'Art Supplies / Paints',
      responsiblePerson: 'James Park', initialSelection: null,
      itemDescription: '36-colour oil pastel set in a hinged tin case. Smooth, richly pigmented. Suitable for artists and students. Conforms to EN71.',
    },
  },
  {
    id: 'sl-023', room: 'Room B', shelf: 'Shelf 2', position: 'B-02-04',
    product: {
      itemNo: 'PM-ST-012', productName: 'DT Spring Stamp Set',
      thumbnail: 'https://placehold.co/80x80/34d399/ffffff?text=ST',
      status: 'Production',
      brand: 'Sparkle Studio', category: 'Crafts / Paper Craft',
      responsiblePerson: 'Wei Zhang', initialSelection: '2024-11-30',
      itemDescription: 'Spring-themed foam stamp set with 12 designs, 2 ink pads (red and blue), and stamp positioning tray. Washable ink.',
    },
  },

  // ── Room B · Shelf 3 ─────────────────────────────────────────────────
  {
    id: 'sl-024', room: 'Room B', shelf: 'Shelf 3', position: 'B-03-01',
    product: {
      itemNo: 'PM-PC-044', productName: 'WMT Paper Craft Bundle',
      thumbnail: 'https://placehold.co/80x80/38bdf8/ffffff?text=PC',
      status: 'Production',
      brand: 'Paramont Basics', category: 'Crafts / Paper Craft',
      responsiblePerson: 'Sarah Thompson', initialSelection: '2024-10-05',
      itemDescription: 'All-in-one paper craft bundle: 120-sheet origami pack, 20 card stock sheets, 2 scissors, bone folder, and adhesive roller.',
    },
  },
  {
    id: 'sl-025', room: 'Room B', shelf: 'Shelf 3', position: 'B-03-02',
    product: {
      itemNo: 'PM-BP-018', productName: 'TGT Brush Pen Calligraphy Set',
      thumbnail: 'https://placehold.co/80x80/e879f9/ffffff?text=BP',
      status: 'Pre-selected',
      brand: 'DrawRight', category: 'Stationery / Writing',
      responsiblePerson: 'James Park', initialSelection: '2025-01-20',
      itemDescription: 'Calligraphy brush pen set with 6 ink colours, practice pad, and beginner guide booklet. Water-based, blendable inks.',
    },
  },
  { id: 'sl-026', room: 'Room B', shelf: 'Shelf 3', position: 'B-03-03', product: null },
  {
    id: 'sl-027', room: 'Room B', shelf: 'Shelf 3', position: 'B-03-04',
    product: {
      itemNo: 'PM-FP-029', productName: 'DT Fabric Paint Set 6pc',
      thumbnail: 'https://placehold.co/80x80/f97316/ffffff?text=FP',
      status: 'Concept',
      brand: 'ColorPro', category: 'Art Supplies / Paints',
      responsiblePerson: 'Xiaomei Li', initialSelection: null,
      itemDescription: '6-colour fabric paint set, 30ml bottles. Permanent when heat-set. Suitable for cotton and mixed fibres. Machine washable after curing.',
    },
  },
  {
    id: 'sl-028', room: 'Room B', shelf: 'Shelf 3', position: 'B-03-05',
    product: {
      itemNo: 'PM-OP-011', productName: 'FBW Origami Paper 100-sheet',
      thumbnail: 'https://placehold.co/80x80/f472b6/ffffff?text=OP',
      status: 'Initial Sampled',
      brand: 'Paramont Basics', category: 'Crafts / Paper Craft',
      responsiblePerson: 'Wei Zhang', initialSelection: '2025-02-28',
      itemDescription: '100-sheet origami paper pack in 20 vibrant colours, 15×15cm. Double-sided colour option available. Includes beginner instruction leaflet.',
    },
  },
]
