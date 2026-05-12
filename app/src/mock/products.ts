export interface ProductListItem {
  id: string
  itemNo: string
  name: string
  brand: string
  category: string
  subcategory: string
  stage: 'Concept' | 'Finished' | 'Discontinued'
  itemStatus: 'ACTIVE' | 'HOLD' | 'PASS'
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
    stage: 'Concept', itemStatus: 'ACTIVE', retail: 1.25, moq: 48000,
    hasPatent: true, committed: true, country: 'China', updatedAt: '2024-11-05',
    image: 'https://images.unsplash.com/photo-1605627079912-97c3810a11a4?w=600&q=80',
  },
  {
    id: 'p-02', itemNo: '1008791',
    name: 'Watercolor Paint Set – 36 Vibrant Colors',
    brand: 'WM - Hello Hobby', category: 'Art Supplies', subcategory: 'Paints',
    stage: 'Finished', itemStatus: 'ACTIVE', retail: 2.50, moq: 24000,
    hasPatent: false, committed: true, country: 'China', updatedAt: '2024-10-28',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80',
  },
  {
    id: 'p-03', itemNo: '1008754',
    name: 'Foam Sticker Sheet Assortment – 200pc',
    brand: 'WM - Hello Hobby', category: 'Crafts', subcategory: 'Paper Craft',
    stage: 'Concept', itemStatus: 'HOLD', retail: 1.00, moq: 72000,
    hasPatent: false, committed: false, country: 'China', updatedAt: '2024-10-15',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  },
  {
    id: 'p-04', itemNo: '1008812',
    name: 'Premium Sketch Pad A4 – 120gsm 50 Sheets',
    brand: 'WM - Hello Hobby', category: 'Art Supplies', subcategory: 'Canvas & Paper',
    stage: 'Finished', itemStatus: 'ACTIVE', retail: 3.00, moq: 36000,
    hasPatent: false, committed: true, country: 'US', updatedAt: '2024-10-20',
    image: 'https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=600&q=80',
  },
  {
    id: 'p-05', itemNo: '1008765',
    name: 'Bubble Wand Outdoor Play Kit – 6pc',
    brand: 'WM - PlaySmart', category: 'Toys & Games', subcategory: 'Outdoor Toys',
    stage: 'Concept', itemStatus: 'ACTIVE', retail: 1.50, moq: 60000,
    hasPatent: false, committed: false, country: 'China', updatedAt: '2024-09-30',
    image: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=600&q=80',
  },
  {
    id: 'p-06', itemNo: '1008730',
    name: 'Holiday Wreath DIY Craft Kit',
    brand: 'WM - Hello Hobby', category: 'Party & Seasonal', subcategory: 'Holiday Décor',
    stage: 'Discontinued', itemStatus: 'PASS', retail: 4.00, moq: 12000,
    hasPatent: false, committed: false, country: 'China', updatedAt: '2024-08-14',
    image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=600&q=80',
  },
  {
    id: 'p-07', itemNo: '1008840',
    name: 'Wooden Jigsaw Puzzle – Scenic Landscape 500pc',
    brand: 'WM - PlaySmart', category: 'Toys & Games', subcategory: 'Puzzles',
    stage: 'Finished', itemStatus: 'ACTIVE', retail: 5.00, moq: 18000,
    hasPatent: true, committed: true, country: 'China', updatedAt: '2024-11-01',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80',
  },
  {
    id: 'p-08', itemNo: '1008799',
    name: 'Embroidery Starter Kit – Floral Hoop Set',
    brand: 'WM - Hello Hobby', category: 'Crafts', subcategory: 'Sewing & Needlework',
    stage: 'Concept', itemStatus: 'ACTIVE', retail: 2.75, moq: 30000,
    hasPatent: false, committed: true, country: 'China', updatedAt: '2024-10-10',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80',
  },
  {
    id: 'p-09', itemNo: '1008778',
    name: 'Glitter Glue Pen Set – 12 Colors',
    brand: 'WM - Hello Hobby', category: 'Art Supplies', subcategory: 'Brushes & Tools',
    stage: 'Concept', itemStatus: 'HOLD', retail: 1.75, moq: 42000,
    hasPatent: false, committed: false, country: 'China', updatedAt: '2024-09-22',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80',
  },
  {
    id: 'p-10', itemNo: '1008856',
    name: 'Party Balloon Garland Kit – 120pc Pastel',
    brand: 'WM - PartyPop', category: 'Party & Seasonal', subcategory: 'Party Supplies',
    stage: 'Concept', itemStatus: 'ACTIVE', retail: 3.50, moq: 24000,
    hasPatent: false, committed: false, country: 'China', updatedAt: '2024-11-03',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80',
  },
  {
    id: 'p-11', itemNo: '1008817',
    name: 'Spiral Notebook 5-Pack – A5 Ruled',
    brand: 'WM - DeskMate', category: 'Stationery', subcategory: 'Notebooks',
    stage: 'Finished', itemStatus: 'ACTIVE', retail: 2.25, moq: 48000,
    hasPatent: false, committed: true, country: 'US', updatedAt: '2024-10-08',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80',
  },
  {
    id: 'p-12', itemNo: '1008803',
    name: 'Strategy Board Game – 2-4 Players Ages 8+',
    brand: 'WM - PlaySmart', category: 'Toys & Games', subcategory: 'Board Games',
    stage: 'Finished', itemStatus: 'ACTIVE', retail: 8.00, moq: 12000,
    hasPatent: true, committed: true, country: 'China', updatedAt: '2024-10-25',
    image: 'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=600&q=80',
  },
]

export const CATEGORY_TREE = [
  { name: 'Crafts',          children: ['Yarn', 'Paper Craft', 'Drawing & Painting', 'Sewing & Needlework'] },
  { name: 'Toys & Games',    children: ['Outdoor Toys', 'Board Games', 'Educational', 'Puzzles'] },
  { name: 'Art Supplies',    children: ['Brushes & Tools', 'Canvas & Paper', 'Paints'] },
  { name: 'Party & Seasonal',children: ['Holiday Décor', 'Party Supplies', 'Gift Wrap'] },
  { name: 'Stationery',      children: ['Notebooks', 'Writing Instruments', 'Accessories'] },
]
