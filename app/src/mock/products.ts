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
  hierarchy: string      // PARENT-CHILD hierarchy value
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
    brand: 'WM - Hello Hobby', category: 'Crafts', subcategory: 'Yarn & Fiber Arts', subsubcategory: 'Pom-Pom Kits', hierarchy: 'CRAFT-POMS',
    status: 'Concept', retail: 1.25, moq: 48000,
    hasPatent: true, committed: true, country: 'China', updatedAt: '2024-11-05',
    image: `${import.meta.env.BASE_URL}Turtle.jpg`,
    everydaySeasonal: 'Everyday', hasSample: true,
  },
  {
    id: 'p-02', itemNo: '1008791',
    name: 'Watercolor Paint Set – 36 Vibrant Colors',
    brand: 'WM - Hello Hobby', category: 'Art Supplies', subcategory: 'Painting', subsubcategory: 'Watercolor', hierarchy: 'ART-PAINTS',
    status: 'Production', retail: 2.50, moq: 24000,
    hasPatent: false, committed: true, country: 'China', updatedAt: '2024-10-28',
    image: `${import.meta.env.BASE_URL}Turtle.jpg`,
    everydaySeasonal: 'Everyday', hasSample: true,
  },
  {
    id: 'p-03', itemNo: '1008754',
    name: 'Foam Sticker Sheet Assortment – 200pc',
    brand: 'WM - Hello Hobby', category: 'Crafts', subcategory: 'Paper Crafts', subsubcategory: 'Foam Stickers', hierarchy: 'CRAFT-STICKERS',
    status: 'Proposed', retail: 1.00, moq: 72000,
    hasPatent: false, committed: false, country: 'China', updatedAt: '2024-10-15',
    image: `${import.meta.env.BASE_URL}box.webp`,
    everydaySeasonal: 'Everyday', hasSample: false,
  },
  {
    id: 'p-04', itemNo: '1008812',
    name: 'Premium Sketch Pad A4 – 120gsm 50 Sheets',
    brand: 'WM - Hello Hobby', category: 'Art Supplies', subcategory: 'Paper & Canvas', subsubcategory: 'Sketch Pads', hierarchy: 'ART-TOOLS',
    status: 'Production', retail: 3.00, moq: 36000,
    hasPatent: false, committed: true, country: 'US', updatedAt: '2024-10-20',
    image: `${import.meta.env.BASE_URL}Turtle.jpg`,
    everydaySeasonal: 'Everyday', hasSample: true,
  },
  {
    id: 'p-05', itemNo: '1008765',
    name: 'Bubble Wand Outdoor Play Kit – 6pc',
    brand: 'WM - PlaySmart', category: 'Toys & Games', subcategory: 'Outdoor Play', subsubcategory: 'Bubble Toys', hierarchy: 'TOYS/GAMES-OUTDOOR',
    status: 'Pre-selected', retail: 1.50, moq: 60000,
    hasPatent: false, committed: false, country: 'China', updatedAt: '2024-09-30',
    image: `${import.meta.env.BASE_URL}box.webp`,
    everydaySeasonal: 'Everyday', hasSample: false,
  },
  {
    id: 'p-06', itemNo: '1008730',
    name: 'Holiday Wreath DIY Craft Kit',
    brand: 'WM - Hello Hobby', category: 'Party & Seasonal', subcategory: 'Holiday', subsubcategory: 'Wreaths', hierarchy: 'HOME/DÉCOR-INDOOR',
    status: 'Dropped', retail: 4.00, moq: 12000,
    hasPatent: false, committed: false, country: 'China', updatedAt: '2024-08-14',
    image: `${import.meta.env.BASE_URL}Turtle.jpg`,
    everydaySeasonal: 'Seasonal', holiday: 'Christmas', hasSample: false,
  },
  {
    id: 'p-07', itemNo: '1008840',
    name: 'Wooden Jigsaw Puzzle – Scenic Landscape 500pc',
    brand: 'WM - PlaySmart', category: 'Toys & Games', subcategory: 'Puzzles', subsubcategory: 'Jigsaw', hierarchy: 'TOYS/GAMES-PUZZLES',
    status: 'Initial Sampled', retail: 5.00, moq: 18000,
    hasPatent: true, committed: true, country: 'China', updatedAt: '2024-11-01',
    image: `${import.meta.env.BASE_URL}box.webp`,
    everydaySeasonal: 'Everyday', hasSample: true,
  },
  {
    id: 'p-08', itemNo: '1008799',
    name: 'Embroidery Starter Kit – Floral Hoop Set',
    brand: 'WM - Hello Hobby', category: 'Crafts', subcategory: 'Sewing & Needlework', subsubcategory: 'Embroidery', hierarchy: 'CRAFT-OTHER',
    status: 'Pre-selected', retail: 2.75, moq: 30000,
    hasPatent: false, committed: true, country: 'China', updatedAt: '2024-10-10',
    image: `${import.meta.env.BASE_URL}Turtle.jpg`,
    everydaySeasonal: 'Everyday', hasSample: true,
  },
  {
    id: 'p-09', itemNo: '1008778',
    name: 'Glitter Glue Pen Set – 12 Colors',
    brand: 'WM - Hello Hobby', category: 'Art Supplies', subcategory: 'Tools & Accessories', subsubcategory: 'Glitter Pens', hierarchy: 'CRAFT-SEQUINS/GLITTER',
    status: 'Proposed', retail: 1.75, moq: 42000,
    hasPatent: false, committed: false, country: 'China', updatedAt: '2024-09-22',
    image: `${import.meta.env.BASE_URL}box.webp`,
    everydaySeasonal: 'Everyday', hasSample: false,
  },
  {
    id: 'p-10', itemNo: '1008856',
    name: 'Party Balloon Garland Kit – 120pc Pastel',
    brand: 'WM - PartyPop', category: 'Party & Seasonal', subcategory: 'Party Décor', subsubcategory: 'Balloons', hierarchy: 'PARTY-BALLOONS',
    status: 'Concept', retail: 3.50, moq: 24000,
    hasPatent: false, committed: false, country: 'China', updatedAt: '2024-11-03',
    image: `${import.meta.env.BASE_URL}Turtle.jpg`,
    everydaySeasonal: 'Seasonal', holiday: 'Other', hasSample: false,
  },
  {
    id: 'p-11', itemNo: '1008817',
    name: 'Spiral Notebook 5-Pack – A5 Ruled',
    brand: 'WM - DeskMate', category: 'Stationery', subcategory: 'Notebooks & Journals', subsubcategory: 'Spiral', hierarchy: 'STATIONERY/OFFICE-JOURNAL/NOTEBOOK',
    status: 'Production', retail: 2.25, moq: 48000,
    hasPatent: false, committed: true, country: 'US', updatedAt: '2024-10-08',
    image: `${import.meta.env.BASE_URL}box.webp`,
    everydaySeasonal: 'Everyday', hasSample: true,
  },
  {
    id: 'p-12', itemNo: '1008803',
    name: 'Strategy Board Game – 2-4 Players Ages 8+',
    brand: 'WM - PlaySmart', category: 'Toys & Games', subcategory: 'Board & Card Games', subsubcategory: 'Strategy', hierarchy: 'TOYS/GAMES-GAME',
    status: 'Initial Sampled', retail: 8.00, moq: 12000,
    hasPatent: true, committed: true, country: 'China', updatedAt: '2024-10-25',
    image: `${import.meta.env.BASE_URL}Turtle.jpg`,
    everydaySeasonal: 'Everyday', hasSample: true,
  },
]

export const CATEGORY_TREE: { name: string; children: string[] }[] = [
  { name: 'Adult Craft', children: ['Cross Stitch', 'Needle Craft', 'Sewing Kit', 'Sign', 'Yarn Craft Kit'] },
  { name: 'Adult Impulse', children: [] },
  { name: 'Baking', children: ['Baking Bag', 'Baking Pan-Mold', 'Baking tips', 'Cake Topper', 'Cupcake Liners/Wraps', 'Drinkware'] },
  { name: 'Beauty', children: ['Bath Bomb', 'Bath Salt', 'Blemish Tool Kit', 'Brush', 'Bubble Bath', 'Callus Remover', 'Clipper & Tweezer Set', 'Cosmetic Brushes', 'Cosmetic Finger Blender', 'Cosmetic Kit', 'Cuticle Oil', 'Cuticle Trimmer', 'Emery Board', 'Eye Care', 'Eye Shadow', 'Eyebrow Shaper', 'Eyelash Curler', 'Eyelashes', 'Face Mask', 'Face Paint', 'Facial Brush', 'Facial Buff', 'Facial Mask', 'Facial Roller', 'Facial Shaver', 'Hair Tools', 'Lip Color', 'Lip Glitter', 'Lip Gloss', 'Lip Mask', 'Lip Plumper', 'Lip Repair', 'Lip Scrub', 'Lip Stick', 'Loofah', 'Makeup Kit', 'Manicure Set', 'Mirror', 'Mittens & Gloves', 'Nail Block', 'Nail Brush', 'Nail Buffer', 'Nail Clipper', 'Nail Essentials', 'Nail File', 'Nail Nipper Set', 'Nail Pen', 'Nail Polish', 'Nail Sets', 'Nail Smoother', 'Nail Soak Off Clips', 'Nail Sticker', 'Nail Wrap', 'Nail Wraps', 'Nails - Press on Nails', 'Nylon Bags', 'Pedicure Paddle', 'Pedicure Set', 'Pencil Sharpener', 'Pumice Stone', 'Skin Care Tool', 'Skincare', 'Sponges - Cosmetic', 'Tweezers', 'Wristband'] },
  { name: 'Cozy Craftworks', children: [] },
  { name: 'General Craft', children: ['3D Kit', '3D Printing', 'Candle Making', 'Canvas Art', 'Charms', 'Cording - Elastic', 'Cording - Elastic Bands', 'Cording - Jute', 'Cording - Twine', 'Embroidered Patches', 'Embroidery Thread', 'Fill', 'Flexible Magnets', 'Fur', 'Glitter', 'Glitter Glue', 'Glue', 'Jewelry', 'Jewelry - Bracelets', 'Jewelry - Necklace', 'Jewelry - Novelty', 'Jewelry - Shrink', 'Jewelry - Wood Jewelry Kit', 'Jewelry -Slap Bracelets & Other Metal Jewelry', 'Keychains', 'Lolly Stick Kit', 'Mason Jar Crafts', 'Polyfoam - Shape', 'Rainbow Heart Kit', 'Ribbon', 'Scissors', 'Sequins', 'Storage Box', 'Tools', 'Tote Bag', 'Wiggle Eyes', 'Wood - Clothes Pins', 'Wood - Craft', 'Wood - Sticks'] },
  { name: 'Gifting', children: ['Paper Wrappings'] },
  { name: 'Hair Accessories', children: ['Hair Accessory Set', 'Hair Bands', 'Hair Claw', 'Hair Clips & Decoration', 'Hair Color', 'Hair Ties', 'Hairpins', 'Headband', 'Scissor & Comb Set', 'Scrunchie'] },
  { name: 'Home Decor', children: ['Candle - Décor', 'Door Cover', 'Figurine', 'Flower Pot', 'Frame - Wood', 'Garden Flag', 'Gel Clings', 'Vase', 'Wood - Décor'] },
  { name: 'Household', children: ['Cases / Satchels', 'Clothes Pins - Plastic', 'Clothes Pins - Wood', 'Clothespins', 'Doilies', 'Egg Whisk', 'Lint Roller', 'Plastic Kitchenware', 'Plastic Table Cover', 'Sequin Bag', 'Travel Bag & Bottles', 'Travel Bottle', 'Travel/Sport Bag'] },
  { name: 'Kids Craft', children: ['Beads', 'Beads - Pearls', 'Beads - Pony Beads', 'Bells', 'Cast Iron Alphabet', 'Ceramics', 'Chenille Stems', 'Classroom Decor', 'CleanColoring Paint', 'Coloring Books', 'Compound - Foam Clay', 'Compounds - Air Dry Clay', 'Compounds - Clay', 'Compounds - Cloud Sand', 'Compounds - Dough', 'Compounds - Kits & Sets', 'Compounds - Putty', 'Compounds - Sand', 'Compounds - Slime', 'Compounds - Snough Ball', 'Craft Kits', 'Craft Sticks', 'Craft Value', 'Craft-plastic', 'Education', 'Eggs & Marker', 'Faux Snow', 'Feathers', 'Felt Sheets', 'Foam - 3D Kit', 'Foam - Craft', 'Foam - Shapes', 'Foam - Sheets', 'Gemstones', 'Hand Kit', 'Mail Box', 'On The Go Accessories', 'Paint', 'Paint Brushes', 'Paint Marker', 'Paint Pallets', 'Paints & Paint Activity', 'Pom Pom Trim', 'Pom Poms', 'Rock Paint Kit', 'Sand Art', 'Scratch Art', 'Sponges - Art', 'Sponges - Paint Rollers', 'Stickers - Felt', 'Stickers - Gems', 'Suncatchers', 'Tape - Craft', 'Watercolor Set'] },
  { name: 'Kids Impulse', children: [] },
  { name: 'Kitchenware', children: [] },
  { name: 'Paper Craft', children: ['Bags', 'Paper Bags & Boxes', 'Papercraft-Scrapbooking', 'Stickers - Alphabet', 'Stickers - Chipboard', 'Stickers - EVA', 'Stickers - Vinyl', 'Tape - Foam', 'Tape - Glitter', 'Tattoo Pen'] },
  { name: 'Party', children: ['Baby', 'Balloons', 'Candle - Party', 'Confetti', 'Confetti Heart', 'Felt Banner', 'Fetti Pop', 'Give-Aways', 'Masks', 'Novelty Glasses', 'Paper Napkins', 'Paper Tableware', 'Party Decor/Favors', 'Plastic Cup, Plates Bowls', 'Play Money', 'Pullback Car', 'Silly Streamers', 'Table Scatter', 'Tablecloth', 'Treasure Coins', 'Wearables', 'Whistles', 'Wood - Food Picks'] },
  { name: 'Seasonal Decor', children: ['Bag Décor', 'Felt Basket', 'Felt Easter Basket', 'Foam Basket', 'Mini Nutcracker', 'Mini Trees', 'Ornament Hooks', 'Ornaments', 'Plastic Heart', 'Snowglobe', 'Tinsel', 'Wood - Statues / Ornaments', 'Wreath'] },
  { name: 'Stationery', children: ['Binders / Folders', 'Bobbler', 'Bookmarks', 'Cards & Envelopes', 'Chalk', 'Chalkboard - Tags', 'Classroom Tools', 'CleanColoring Markers', 'Clip Organizer', 'Composition Book', 'Crayons', 'Erasers', 'Foam Clay', 'Highlighters', 'Journal', 'List Pad', 'Magic Marker', 'Markers', 'Metal Paper Clips', 'Mini Stampers', 'Notebooks', 'Notepads', 'Office Tools', 'Paper Clips', 'Paper Clips - Other', 'Pencil Case', 'Pencil Sharpener', 'Pencils', 'Pencils - Mechanical Pencils', 'Pens', 'Pens - Ballpoint', 'Pens - Felt Tip', 'Pens - Gel Pen', 'Pens - Mini', 'Pens - Mini Gel Pens', 'Pens - Rainbow Pens', 'Pens - Squishable Pen', 'Planner', 'Push Pins', 'Stamper', 'Stationery Kit', 'Stationery Pouch', 'Stencils', 'Stickers', 'Stickers - Scrapbooking', 'Tape', 'Thumb Tacks', 'To-Do List'] },
  { name: 'Toys & Games', children: ['Bath Toy - EVA', 'Bath Toy - Plastic', 'Bubbles', 'Card&Board Games', 'Flying Ball', 'Frog Jumpers', 'Games', 'Indoor & Outdoor Play', 'Kind Mind', 'Magic Wands', 'Mini Dinosaurs', 'Mini Maracas', 'Mini Spidey Balls', 'Puzzles', 'Rocket Launcher', 'STEM Kit', 'Sand Tools', 'Soccer Accessories', 'Squishy', 'Tin Game', 'Tooblerz', 'Toy Kit', 'Water Gun', 'Whackable', 'Wood - Toy'] },
]

export const HIERARCHY_TREE: { name: string; children: { label: string; value: string }[] }[] = [
  { name: 'ART', children: [{ label: 'CRAYONS', value: 'ART-CRAYONS' }, { label: 'PAINTS', value: 'ART-PAINTS' }, { label: 'TOOLS', value: 'ART-TOOLS' }, { label: 'OTHER', value: 'ART-OTHER' }] },
  { name: 'CRAFT', children: [{ label: 'ACTIVITY', value: 'CRAFT-ACTIVITY' }, { label: 'ADHESIVES', value: 'CRAFT-ADHESIVES' }, { label: 'BAG/TAG/WRAP/PAPER', value: 'CRAFT-BAG/TAG/WRAP/PAPER' }, { label: 'BEADS', value: 'CRAFT-BEADS' }, { label: 'CANVAS', value: 'CRAFT-CANVAS' }, { label: 'CHENILLE STEMS', value: 'CRAFT-CHENILLE STEMS' }, { label: 'EMBELLSHMENTS/ACCESSORIES', value: 'CRAFT-EMBELLSHMENTS/ACCESSORIES' }, { label: 'FELT', value: 'CRAFT-FELT' }, { label: 'FOAM', value: 'CRAFT-FOAM' }, { label: 'GEMS', value: 'CRAFT-GEMS' }, { label: 'HOUSEHOLD', value: 'CRAFT-HOUSEHOLD' }, { label: 'PAINTS', value: 'CRAFT-PAINTS' }, { label: 'POMS', value: 'CRAFT-POMS' }, { label: 'RIBBON/CORD', value: 'CRAFT-RIBBON/CORD' }, { label: 'SEQUINS/GLITTER', value: 'CRAFT-SEQUINS/GLITTER' }, { label: 'STICKERS', value: 'CRAFT-STICKERS' }, { label: 'STORAGE', value: 'CRAFT-STORAGE' }, { label: 'TAPE', value: 'CRAFT-TAPE' }, { label: 'TOOLS', value: 'CRAFT-TOOLS' }, { label: 'OTHER', value: 'CRAFT-OTHER' }] },
  { name: 'BEAUTY/PERSONAL CARE', children: [{ label: 'BATH', value: 'BEAUTY/PERSONAL CARE-BATH' }, { label: 'BRUSHES', value: 'BEAUTY/PERSONAL CARE-BRUSHES' }, { label: 'FACE', value: 'BEAUTY/PERSONAL CARE-FACE' }, { label: 'HAIR', value: 'BEAUTY/PERSONAL CARE-HAIR' }, { label: 'LIP', value: 'BEAUTY/PERSONAL CARE-LIP' }, { label: 'NAIL', value: 'BEAUTY/PERSONAL CARE-NAIL' }, { label: 'STORAGE', value: 'BEAUTY/PERSONAL CARE-STORAGE' }, { label: 'TOOLS', value: 'BEAUTY/PERSONAL CARE-TOOLS' }, { label: 'OTHER', value: 'BEAUTY/PERSONAL CARE-OTHER' }] },
  { name: 'HOME/DÉCOR', children: [{ label: 'INDOOR', value: 'HOME/DÉCOR-INDOOR' }, { label: 'OUTDOOR', value: 'HOME/DÉCOR-OUTDOOR' }, { label: 'STORAGE', value: 'HOME/DÉCOR-STORAGE' }, { label: 'OTHER', value: 'HOME/DÉCOR-OTHER' }] },
  { name: 'STATIONERY/OFFICE', children: [{ label: 'BOOKMARKS', value: 'STATIONERY/OFFICE-BOOKMARKS' }, { label: 'CARDS', value: 'STATIONERY/OFFICE-CARDS' }, { label: 'CLASSROOM', value: 'STATIONERY/OFFICE-CLASSROOM' }, { label: 'ERASRES', value: 'STATIONERY/OFFICE-ERASRES' }, { label: 'JOURNAL/NOTEBOOK', value: 'STATIONERY/OFFICE-JOURNAL/NOTEBOOK' }, { label: 'MARKERS', value: 'STATIONERY/OFFICE-MARKERS' }, { label: 'PENCILS', value: 'STATIONERY/OFFICE-PENCILS' }, { label: 'PENS', value: 'STATIONERY/OFFICE-PENS' }, { label: 'STICKERS', value: 'STATIONERY/OFFICE-STICKERS' }, { label: 'STICKY NOTES', value: 'STATIONERY/OFFICE-STICKY NOTES' }, { label: 'STORAGE', value: 'STATIONERY/OFFICE-STORAGE' }, { label: 'TOOLS', value: 'STATIONERY/OFFICE-TOOLS' }, { label: 'OTHER', value: 'STATIONERY/OFFICE-OTHER' }] },
  { name: 'PARTY', children: [{ label: 'BAG/TAG/WRAP/PAPER', value: 'PARTY-BAG/TAG/WRAP/PAPER' }, { label: 'BAKING', value: 'PARTY-BAKING' }, { label: 'BALLOONS', value: 'PARTY-BALLOONS' }, { label: 'FAVORS', value: 'PARTY-FAVORS' }, { label: 'STREAMERS', value: 'PARTY-STREAMERS' }, { label: 'OTHER', value: 'PARTY-OTHER' }] },
  { name: 'TOYS/GAMES', children: [{ label: 'BATH', value: 'TOYS/GAMES-BATH' }, { label: 'CHALK', value: 'TOYS/GAMES-CHALK' }, { label: 'COMPOUNDS', value: 'TOYS/GAMES-COMPOUNDS' }, { label: 'GAME', value: 'TOYS/GAMES-GAME' }, { label: 'OUTDOOR', value: 'TOYS/GAMES-OUTDOOR' }, { label: 'PUZZLES', value: 'TOYS/GAMES-PUZZLES' }, { label: 'TOOBLERZ', value: 'TOYS/GAMES-TOOBLERZ' }, { label: 'OTHER', value: 'TOYS/GAMES-OTHER' }] },
]
