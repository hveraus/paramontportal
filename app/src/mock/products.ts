export type ProductStatus = 'Concept' | 'Proposed' | 'Pre-selected' | 'Initial Sampled' | 'Production' | 'Dropped'

export type HolidayType = 'Halloween' | 'Christmas' | 'Easter' | 'Thanksgiving' | 'Other'

export interface ProductListItem {
  id: string
  itemNo: string
  name: string
  brand: string
  category: string       // L1
  subcategory: string    // L2
  subsubcategory: string // L3
  status: ProductStatus
  retail: number | null
  moq: number | null
  hasPatent: boolean
  committed: boolean
  country: 'China' | 'US'
  updatedAt: string
  image: string
  everydaySeasonal: 'Everyday' | 'Seasonal'
  holiday?: HolidayType
  hasSample: boolean
}

export const MOCK_PRODUCTS: ProductListItem[] = [
  {
    id: 'p-01', itemNo: '1008823',
    name: 'Pom-Pom Yarn Craft Kit – Rainbow 12pc',
    brand: 'WM - Hello Hobby', category: 'Crafts', subcategory: 'Yarn & Fiber Arts', subsubcategory: 'Pom-Pom Kits',
    status: 'Concept', retail: 1.25, moq: 48000,
    hasPatent: true, committed: true, country: 'China', updatedAt: '2024-11-05',
    image: `${import.meta.env.BASE_URL}Turtle.jpg`,
    everydaySeasonal: 'Everyday', hasSample: true,
  },
  {
    id: 'p-02', itemNo: '1008791',
    name: 'Watercolor Paint Set – 36 Vibrant Colors',
    brand: 'WM - Hello Hobby', category: 'Art Supplies', subcategory: 'Painting', subsubcategory: 'Watercolor',
    status: 'Production', retail: 2.50, moq: 24000,
    hasPatent: false, committed: true, country: 'China', updatedAt: '2024-10-28',
    image: `${import.meta.env.BASE_URL}Turtle.jpg`,
    everydaySeasonal: 'Everyday', hasSample: true,
  },
  {
    id: 'p-03', itemNo: '1008754',
    name: 'Foam Sticker Sheet Assortment – 200pc',
    brand: 'WM - Hello Hobby', category: 'Crafts', subcategory: 'Paper Crafts', subsubcategory: 'Foam Stickers',
    status: 'Proposed', retail: 1.00, moq: 72000,
    hasPatent: false, committed: false, country: 'China', updatedAt: '2024-10-15',
    image: `${import.meta.env.BASE_URL}box.webp`,
    everydaySeasonal: 'Everyday', hasSample: false,
  },
  {
    id: 'p-04', itemNo: '1008812',
    name: 'Premium Sketch Pad A4 – 120gsm 50 Sheets',
    brand: 'WM - Hello Hobby', category: 'Art Supplies', subcategory: 'Paper & Canvas', subsubcategory: 'Sketch Pads',
    status: 'Production', retail: 3.00, moq: 36000,
    hasPatent: false, committed: true, country: 'US', updatedAt: '2024-10-20',
    image: `${import.meta.env.BASE_URL}Turtle.jpg`,
    everydaySeasonal: 'Everyday', hasSample: true,
  },
  {
    id: 'p-05', itemNo: '1008765',
    name: 'Bubble Wand Outdoor Play Kit – 6pc',
    brand: 'WM - PlaySmart', category: 'Toys & Games', subcategory: 'Outdoor Play', subsubcategory: 'Bubble Toys',
    status: 'Pre-selected', retail: 1.50, moq: 60000,
    hasPatent: false, committed: false, country: 'China', updatedAt: '2024-09-30',
    image: `${import.meta.env.BASE_URL}box.webp`,
    everydaySeasonal: 'Everyday', hasSample: false,
  },
  {
    id: 'p-06', itemNo: '1008730',
    name: 'Holiday Wreath DIY Craft Kit',
    brand: 'WM - Hello Hobby', category: 'Party & Seasonal', subcategory: 'Holiday', subsubcategory: 'Wreaths',
    status: 'Dropped', retail: 4.00, moq: 12000,
    hasPatent: false, committed: false, country: 'China', updatedAt: '2024-08-14',
    image: `${import.meta.env.BASE_URL}Turtle.jpg`,
    everydaySeasonal: 'Seasonal', holiday: 'Christmas', hasSample: false,
  },
  {
    id: 'p-07', itemNo: '1008840',
    name: 'Wooden Jigsaw Puzzle – Scenic Landscape 500pc',
    brand: 'WM - PlaySmart', category: 'Toys & Games', subcategory: 'Puzzles', subsubcategory: 'Jigsaw',
    status: 'Initial Sampled', retail: 5.00, moq: 18000,
    hasPatent: true, committed: true, country: 'China', updatedAt: '2024-11-01',
    image: `${import.meta.env.BASE_URL}box.webp`,
    everydaySeasonal: 'Everyday', hasSample: true,
  },
  {
    id: 'p-08', itemNo: '1008799',
    name: 'Embroidery Starter Kit – Floral Hoop Set',
    brand: 'WM - Hello Hobby', category: 'Crafts', subcategory: 'Sewing & Needlework', subsubcategory: 'Embroidery',
    status: 'Pre-selected', retail: 2.75, moq: 30000,
    hasPatent: false, committed: true, country: 'China', updatedAt: '2024-10-10',
    image: `${import.meta.env.BASE_URL}Turtle.jpg`,
    everydaySeasonal: 'Everyday', hasSample: true,
  },
  {
    id: 'p-09', itemNo: '1008778',
    name: 'Glitter Glue Pen Set – 12 Colors',
    brand: 'WM - Hello Hobby', category: 'Art Supplies', subcategory: 'Tools & Accessories', subsubcategory: 'Glitter Pens',
    status: 'Proposed', retail: 1.75, moq: 42000,
    hasPatent: false, committed: false, country: 'China', updatedAt: '2024-09-22',
    image: `${import.meta.env.BASE_URL}box.webp`,
    everydaySeasonal: 'Everyday', hasSample: false,
  },
  {
    id: 'p-10', itemNo: '1008856',
    name: 'Party Balloon Garland Kit – 120pc Pastel',
    brand: 'WM - PartyPop', category: 'Party & Seasonal', subcategory: 'Party Décor', subsubcategory: 'Balloons',
    status: 'Concept', retail: 3.50, moq: 24000,
    hasPatent: false, committed: false, country: 'China', updatedAt: '2024-11-03',
    image: `${import.meta.env.BASE_URL}Turtle.jpg`,
    everydaySeasonal: 'Seasonal', holiday: 'Other', hasSample: false,
  },
  {
    id: 'p-11', itemNo: '1008817',
    name: 'Spiral Notebook 5-Pack – A5 Ruled',
    brand: 'WM - DeskMate', category: 'Stationery', subcategory: 'Notebooks & Journals', subsubcategory: 'Spiral',
    status: 'Production', retail: 2.25, moq: 48000,
    hasPatent: false, committed: true, country: 'US', updatedAt: '2024-10-08',
    image: `${import.meta.env.BASE_URL}box.webp`,
    everydaySeasonal: 'Everyday', hasSample: true,
  },
  {
    id: 'p-12', itemNo: '1008803',
    name: 'Strategy Board Game – 2-4 Players Ages 8+',
    brand: 'WM - PlaySmart', category: 'Toys & Games', subcategory: 'Board & Card Games', subsubcategory: 'Strategy',
    status: 'Initial Sampled', retail: 8.00, moq: 12000,
    hasPatent: true, committed: true, country: 'China', updatedAt: '2024-10-25',
    image: `${import.meta.env.BASE_URL}Turtle.jpg`,
    everydaySeasonal: 'Everyday', hasSample: true,
  },
]

export const CATEGORY_TREE = [
  { name: 'Crafts', children: [
    { name: 'Yarn & Fiber Arts',    children: ['Pom-Pom Kits', 'Knitting & Crochet', 'Weaving'] },
    { name: 'Paper Crafts',         children: ['Foam Stickers', 'Origami', 'Scrapbooking'] },
    { name: 'Sewing & Needlework',  children: ['Embroidery', 'Cross Stitch', 'Sewing Kits'] },
    { name: 'Drawing & Illustration', children: ['Sketching', 'Illustration Kits'] },
  ]},
  { name: 'Toys & Games', children: [
    { name: 'Outdoor Play',         children: ['Bubble Toys', 'Sports Toys', 'Garden Games'] },
    { name: 'Puzzles',              children: ['Jigsaw', '3D Puzzles', 'Logic Games'] },
    { name: 'Board & Card Games',   children: ['Strategy', 'Family', 'Card Games'] },
    { name: 'Educational',         children: ['STEM', 'Building Sets', 'Learning'] },
  ]},
  { name: 'Art Supplies', children: [
    { name: 'Painting',             children: ['Watercolor', 'Acrylic', 'Oil'] },
    { name: 'Paper & Canvas',       children: ['Sketch Pads', 'Canvas Boards', 'Watercolor Paper'] },
    { name: 'Tools & Accessories',  children: ['Glitter Pens', 'Brushes', 'Palettes'] },
  ]},
  { name: 'Party & Seasonal', children: [
    { name: 'Holiday',              children: ['Wreaths', 'Christmas', 'Halloween'] },
    { name: 'Party Décor',          children: ['Balloons', 'Banners', 'Tableware'] },
    { name: 'Gift Wrapping',        children: ['Ribbons', 'Bags & Boxes', 'Tags'] },
  ]},
  { name: 'Stationery', children: [
    { name: 'Notebooks & Journals', children: ['Spiral', 'Hardcover', 'Bullet Journals'] },
    { name: 'Writing Instruments',  children: ['Pens', 'Pencils', 'Highlighters'] },
    { name: 'Desk Accessories',     children: ['Organizers', 'Clips & Fasteners'] },
  ]},
]
