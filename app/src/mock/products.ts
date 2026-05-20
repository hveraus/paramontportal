export type ProductStatus = 'Concept' | 'Proposed' | 'Pre-selected' | 'Initial Sampled' | 'Production' | 'Dropped'

export interface ProductListItem {
  id: string
  itemNo: string
  name: string
  brand: string
  category: string
  subcategory: string
  status: ProductStatus
  retail: number | null
  moq: number | null
  hasPatent: boolean
  committed: boolean
  country: 'China' | 'US'
  updatedAt: string
  image: string
}

export const MOCK_PRODUCTS: ProductListItem[] = [
  {
    id: 'p-01', itemNo: '1008823',
    name: 'Pom-Pom Yarn Craft Kit – Rainbow 12pc',
    brand: 'WM - Hello Hobby', category: 'Crafts', subcategory: 'Yarn',
    status: 'Concept', retail: 1.25, moq: 48000,
    hasPatent: true, committed: true, country: 'China', updatedAt: '2024-11-05',
    image: `${import.meta.env.BASE_URL}Turtle.jpg`,
  },
  {
    id: 'p-02', itemNo: '1008791',
    name: 'Watercolor Paint Set – 36 Vibrant Colors',
    brand: 'WM - Hello Hobby', category: 'Art Supplies', subcategory: 'Paints',
    status: 'Production', retail: 2.50, moq: 24000,
    hasPatent: false, committed: true, country: 'China', updatedAt: '2024-10-28',
    image: `${import.meta.env.BASE_URL}Turtle.jpg`,
  },
  {
    id: 'p-03', itemNo: '1008754',
    name: 'Foam Sticker Sheet Assortment – 200pc',
    brand: 'WM - Hello Hobby', category: 'Crafts', subcategory: 'Paper Craft',
    status: 'Proposed', retail: 1.00, moq: 72000,
    hasPatent: false, committed: false, country: 'China', updatedAt: '2024-10-15',
    image: `${import.meta.env.BASE_URL}box.webp`,
  },
  {
    id: 'p-04', itemNo: '1008812',
    name: 'Premium Sketch Pad A4 – 120gsm 50 Sheets',
    brand: 'WM - Hello Hobby', category: 'Art Supplies', subcategory: 'Canvas & Paper',
    status: 'Production', retail: 3.00, moq: 36000,
    hasPatent: false, committed: true, country: 'US', updatedAt: '2024-10-20',
    image: `${import.meta.env.BASE_URL}Turtle.jpg`,
  },
  {
    id: 'p-05', itemNo: '1008765',
    name: 'Bubble Wand Outdoor Play Kit – 6pc',
    brand: 'WM - PlaySmart', category: 'Toys & Games', subcategory: 'Outdoor Toys',
    status: 'Pre-selected', retail: 1.50, moq: 60000,
    hasPatent: false, committed: false, country: 'China', updatedAt: '2024-09-30',
    image: `${import.meta.env.BASE_URL}box.webp`,
  },
  {
    id: 'p-06', itemNo: '1008730',
    name: 'Holiday Wreath DIY Craft Kit',
    brand: 'WM - Hello Hobby', category: 'Party & Seasonal', subcategory: 'Holiday Décor',
    status: 'Dropped', retail: 4.00, moq: 12000,
    hasPatent: false, committed: false, country: 'China', updatedAt: '2024-08-14',
    image: `${import.meta.env.BASE_URL}Turtle.jpg`,
  },
  {
    id: 'p-07', itemNo: '1008840',
    name: 'Wooden Jigsaw Puzzle – Scenic Landscape 500pc',
    brand: 'WM - PlaySmart', category: 'Toys & Games', subcategory: 'Puzzles',
    status: 'Initial Sampled', retail: 5.00, moq: 18000,
    hasPatent: true, committed: true, country: 'China', updatedAt: '2024-11-01',
    image: `${import.meta.env.BASE_URL}box.webp`,
  },
  {
    id: 'p-08', itemNo: '1008799',
    name: 'Embroidery Starter Kit – Floral Hoop Set',
    brand: 'WM - Hello Hobby', category: 'Crafts', subcategory: 'Sewing & Needlework',
    status: 'Pre-selected', retail: 2.75, moq: 30000,
    hasPatent: false, committed: true, country: 'China', updatedAt: '2024-10-10',
    image: `${import.meta.env.BASE_URL}Turtle.jpg`,
  },
  {
    id: 'p-09', itemNo: '1008778',
    name: 'Glitter Glue Pen Set – 12 Colors',
    brand: 'WM - Hello Hobby', category: 'Art Supplies', subcategory: 'Brushes & Tools',
    status: 'Proposed', retail: 1.75, moq: 42000,
    hasPatent: false, committed: false, country: 'China', updatedAt: '2024-09-22',
    image: `${import.meta.env.BASE_URL}box.webp`,
  },
  {
    id: 'p-10', itemNo: '1008856',
    name: 'Party Balloon Garland Kit – 120pc Pastel',
    brand: 'WM - PartyPop', category: 'Party & Seasonal', subcategory: 'Party Supplies',
    status: 'Concept', retail: 3.50, moq: 24000,
    hasPatent: false, committed: false, country: 'China', updatedAt: '2024-11-03',
    image: `${import.meta.env.BASE_URL}Turtle.jpg`,
  },
  {
    id: 'p-11', itemNo: '1008817',
    name: 'Spiral Notebook 5-Pack – A5 Ruled',
    brand: 'WM - DeskMate', category: 'Stationery', subcategory: 'Notebooks',
    status: 'Production', retail: 2.25, moq: 48000,
    hasPatent: false, committed: true, country: 'US', updatedAt: '2024-10-08',
    image: `${import.meta.env.BASE_URL}box.webp`,
  },
  {
    id: 'p-12', itemNo: '1008803',
    name: 'Strategy Board Game – 2-4 Players Ages 8+',
    brand: 'WM - PlaySmart', category: 'Toys & Games', subcategory: 'Board Games',
    status: 'Initial Sampled', retail: 8.00, moq: 12000,
    hasPatent: true, committed: true, country: 'China', updatedAt: '2024-10-25',
    image: `${import.meta.env.BASE_URL}Turtle.jpg`,
  },
]

export const CATEGORY_TREE = [
  { name: 'Crafts',          children: ['Yarn', 'Paper Craft', 'Drawing & Painting', 'Sewing & Needlework'] },
  { name: 'Toys & Games',    children: ['Outdoor Toys', 'Board Games', 'Educational', 'Puzzles'] },
  { name: 'Art Supplies',    children: ['Brushes & Tools', 'Canvas & Paper', 'Paints'] },
  { name: 'Party & Seasonal',children: ['Holiday Décor', 'Party Supplies', 'Gift Wrap'] },
  { name: 'Stationery',      children: ['Notebooks', 'Writing Instruments', 'Accessories'] },
]
