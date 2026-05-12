import type { ProductDetail } from '../types'

export const mockProduct: ProductDetail = {
  // ── Basic Info ───────────────────────────────────────────────────────────
  sampleCode:        'PDM-20241001-138',
  itemNo:            '1008823',
  upc:               '12345678905',
  upc12Digit:        '012345678905',
  productName:       'Pom-Pom Yarn Craft Kit – Rainbow 12pc',
  categoryPath:      ['Crafts', 'Yarn', 'Pom-Pom'],
  productCategory:   'NB CRAFT CATEGORY',
  brand:             'WM - Hello Hobby',
  stage:             'Concept',
  itemStatus:        'ACTIVE',
  parentOrBaby:      'Baby',
  parentNumber:      '1008800',
  creatingTeam:      'China',
  initialSelection:  'Dollar Tree',
  committed:         true,
  itemDataFinalized: false,
  borderDomestic:    'Direct Import',
  createdAt:         '2024-09-18 09:30',
  updatedAt:         '2024-11-05 14:32',
  owner: {
    id: 'u01',
    name: 'Xiaomei Li',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=XL&backgroundColor=3b82f6&fontColor=ffffff',
    team: 'China',
  },
  ageGrade:          '6+',
  fobPoint:          'Ningbo',
  factoryName:       'Ningbo Sunshine Craft Co., Ltd.',
  estOrderQty:       48000,
  itemDescription: `
    <p><strong>Features &amp; Benefits:</strong> Rainbow 12-piece pom-pom yarn craft kit for ages 6 and up.</p>
    <ul>
      <li>12 vibrant yarn colors, approx. 15g each</li>
      <li>Includes large and small plastic pom-pom makers plus instruction sheet</li>
      <li>Certified to ASTM F963 &amp; EN71 safety standards</li>
      <li>Hang card retail packaging — ideal for impulse-buy shelf placement</li>
    </ul>
    <p><em>Suitable for school projects, home décor, and seasonal crafts.</em></p>
  `,
  solComments:
    'Color assortment TBD pending buyer confirmation. Insert card artwork to be supplied by US team by Nov 15.',
  productSpec:
    '12 colors × 15g yarn skeins; large pom-pom maker (6cm); small pom-pom maker (3.5cm); multilingual instruction card.',
  itemPackagingSpec:
    'Hang card: 22.5 × 18cm, 350gsm recycled paperboard, full-color front / black ink back. OPP bag sealed.',
  materialBreakdown:
    '85% Acrylic yarn, 10% Polypropylene (pom-pom maker), 5% Recycled paperboard (card).',
  assortmentBreakdown:
    'SKU 1008823-RED, SKU 1008823-BLU, SKU 1008823-YLW … (12 color variants, sold as set).',

  // ── Comment thread ───────────────────────────────────────────────────────
  comments: [
    {
      id: 'c-01',
      date: '2024-10-10 09:14',
      authorId: 'u-sarah',
      authorName: 'Sarah Thompson',
      authorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ST&backgroundColor=f59e0b&fontColor=ffffff',
      team: 'US' as const,
      content: 'Recommend switching the insert card to full-color printing to improve shelf visibility. Can we get a revised cost estimate from the factory?',
    },
    {
      id: 'c-02',
      date: '2024-10-11 14:27',
      authorId: 'u-xiaomei',
      authorName: 'Xiaomei Li',
      authorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=XL&backgroundColor=3b82f6&fontColor=ffffff',
      team: 'NB' as const,
      content: 'Full-color printing adds approx. ¥0.08/unit. Factory quote updated — already included in the latest BOM. Will send revised sample with color insert by end of next week.',
    },
    {
      id: 'c-03',
      date: '2024-10-15 10:52',
      authorId: 'u-sarah',
      authorName: 'Sarah Thompson',
      authorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ST&backgroundColor=f59e0b&fontColor=ffffff',
      team: 'US' as const,
      content: 'Thanks. Also please confirm pom-pom size differentiation vs. competitor SKUs before sample is finalized.',
    },
    {
      id: 'c-04',
      date: '2024-11-01 08:39',
      authorId: 'u-xiaomei',
      authorName: 'Xiaomei Li',
      authorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=XL&backgroundColor=3b82f6&fontColor=ffffff',
      team: 'NB' as const,
      content: "Confirmed. Our large maker produces 6cm poms vs competitor's 5cm. Recommend increasing sample quantity to 20 sets to ensure color consistency validation across the full 12-color range.",
    },
  ],

  // ── Specs ────────────────────────────────────────────────────────────────
  itemHeight:      1.77,
  itemWidth:       7.09,
  itemDepth:       8.86,
  itemWeightG:     185,
  innerHeight:     2.36,
  innerWidth:      7.68,
  innerDepth:      9.45,
  innerWeightLbs:  0.485,
  masterHeight:    14.96,
  masterWidth:     15.75,
  masterDepth:     19.69,
  grossWeightKg:   4.80,
  netWeightKg:     4.20,

  // ── Packaging ────────────────────────────────────────────────────────────
  countPerPackage:   1,
  masterQty:         48,
  innerQty:          6,
  packagingType:     'Hang Card',
  packagingMaterial: 'Recycled Paperboard + OPP Bag',
  upcCode:           '0 12345 67890 5',

  // ── Quality ──────────────────────────────────────────────────────────────
  qualityRecords: [
    {
      id: 'qr-01',
      qualityStatus: 'PENDING' as const,
      qualityDate: '2024-11-08',
      qualityOwner: {
        id: 'u02', name: 'Wei Zhang',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=WZ&backgroundColor=10b981&fontColor=ffffff',
        team: 'China' as const,
      },
      failReason: undefined,
      attachments: [
        { id: 'att-01', name: 'ASTM-F963-Test-Report-PMT00138.pdf', url: '#', type: 'PDF' as const, size: '2.4 MB', uploadedAt: '2024-10-22', uploadedBy: 'Wei Zhang' },
        { id: 'att-02', name: 'EN71-Compliance-Certificate.pdf',    url: '#', type: 'PDF' as const, size: '1.1 MB', uploadedAt: '2024-10-28', uploadedBy: 'Wei Zhang' },
        { id: 'att-03', name: 'Color-Fastness-Lab-Result.pdf',      url: '#', type: 'PDF' as const, size: '856 KB', uploadedAt: '2024-11-01', uploadedBy: 'Xiaomei Li' },
      ],
      images: [
        { id: 'qi-01', url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80', type: 'Reference Images', alt: 'Inspection reference – competitor craft kit' },
        { id: 'qi-02', url: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&q=80', type: 'Reference Images', alt: 'Color swatch reference' },
        { id: 'qi-03', url: '/Turtle.jpg', type: 'Product Render',    alt: 'Product render – inspection round 1' },
        { id: 'qi-04', url: '/box.webp', type: 'Packaging Render',  alt: 'Packaging render – front view' },
      ],
    },
    {
      id: 'qr-02',
      qualityStatus: 'FAIL' as const,
      qualityDate: '2024-09-15',
      qualityOwner: {
        id: 'u02', name: 'Wei Zhang',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=WZ&backgroundColor=10b981&fontColor=ffffff',
        team: 'China' as const,
      },
      failReason: 'Yarn color deviation exceeds tolerance on SKU-RED and SKU-BLU. Insert card print registration off by 2mm.',
      attachments: [
        { id: 'att-04', name: 'Initial-QC-Report-Round1.pdf', url: '#', type: 'PDF' as const, size: '3.1 MB', uploadedAt: '2024-09-15', uploadedBy: 'Wei Zhang' },
      ],
      images: [
        { id: 'qi-05', url: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=800&q=80', type: 'Reference Images', alt: 'Color deviation reference photo' },
      ],
    },
  ],

  // ── Cost ─────────────────────────────────────────────────────────────────
  retail:                  1.25,
  rmbPurchase:             3.80,
  dollarPurchase:          0.527,
  estPlatingMoldingCost:   2800,
  nbSuggestedCogs:         0.620,
  finalizedCogsNb:         0.635,
  totalCogs:               0.710,
  nbGpPercent:             43.2,
  pgusMargin:              12.0,
  fobNbWithPgusMargin:     0.563,
  customerCommission:      5.0,
  diFreightRate:           0.048,
  doFreightRate:           null,
  texasWarehouseCost:      0.012,
  declarationPrice:        0.45,
  dutyCost:                0.034,

  // ── Customs ──────────────────────────────────────────────────────────────
  htsCategory:        'Textile & Craft Supplies',
  htsCode:            '5308.90.0000',
  dutyPercent:        7.5,
  dutyDollar:         0.094,
  tariff:             'Section 301 – List 3',
  extraTariff15:      15.0,
  totalDutyRate:      22.5,
  defectiveAllowance: 3.0,
  countryOfOrigin:    'China',

  // ── Images ───────────────────────────────────────────────────────────────
  images: [
    {
      id: 'img-01',
      url: '/Turtle.jpg',
      type: 'Product Render', alt: 'Pom-Pom Yarn Kit – main product render',
    },
    {
      id: 'img-02',
      url: '/box.webp',
      type: 'Packaging Render', alt: 'Hang card packaging front view',
    },
    {
      id: 'img-03',
      url: '/box.webp',
      type: 'Packaging Render', alt: 'Hang card packaging back view',
    },
    {
      id: 'img-04',
      url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80',
      type: 'Reference Images', alt: 'Market reference – competitor craft kit',
    },
    {
      id: 'img-05',
      url: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&q=80',
      type: 'Reference Images', alt: 'Color swatch reference',
    },
  ],

  // ── Certifications ───────────────────────────────────────────────────────
  certifications: [
    {
      id: 'cert-01',
      certType: 'CE' as const,
      certNumber: 'CE-2024-NB-00138',
      certDate: '2024-06-10',
      expiryDate: '2027-06-09',
      files: [
        {
          id: 'cf-01',
          name: 'CE-Declaration-of-Conformity-NB00138.pdf',
          url: '#',
          size: '1.2 MB',
          uploadedAt: '2024-06-12',
        },
      ],
    },
    {
      id: 'cert-02',
      certType: 'RoHS' as const,
      certNumber: 'ROHS-2024-0456',
      certDate: '2024-05-20',
      expiryDate: '2026-05-19',
      files: [
        {
          id: 'cf-02',
          name: 'RoHS-Test-Report-PMT00138.pdf',
          url: '#',
          size: '2.8 MB',
          uploadedAt: '2024-05-22',
        },
      ],
    },
    {
      id: 'cert-03',
      certType: 'Other' as const,
      certNumber: 'ASTM-F963-2024-0138',
      certDate: '2024-10-22',
      expiryDate: null,
      files: [
        {
          id: 'cf-03',
          name: 'ASTM-F963-Test-Report-PMT00138.pdf',
          url: '#',
          size: '2.4 MB',
          uploadedAt: '2024-10-22',
        },
      ],
    },
  ],

  // ── Patents ──────────────────────────────────────────────────────────────
  patents: [
    {
      id: 'pat-01',
      patentName: 'Dual-Size Pom-Pom Maker with Integrated Yarn Guide',
      patentNumber: 'US11,234,567 B2',
      applicationDate: '2022-03-14',
      status: 'Granted',
      files: [
        {
          id: 'pf-01',
          name: 'US11234567-Grant-Certificate.pdf',
          url: '#',
          size: '1.8 MB',
          uploadedAt: '2023-06-20',
        },
      ],
    },
    {
      id: 'pat-02',
      patentName: 'Ergonomic Yarn Tensioner for Craft Kits',
      patentNumber: 'CN202310456789.X',
      applicationDate: '2023-04-01',
      status: 'Pending',
      files: [
        {
          id: 'pf-02',
          name: 'CN202310456789-Application.pdf',
          url: '#',
          size: '3.2 MB',
          uploadedAt: '2023-04-10',
        },
        {
          id: 'pf-03',
          name: 'CN202310456789-Drawings.pdf',
          url: '#',
          size: '5.7 MB',
          uploadedAt: '2023-04-10',
        },
      ],
    },
    {
      id: 'pat-03',
      patentName: 'Biodegradable Packaging Insert for Craft Accessories',
      patentNumber: 'US10,987,654 B1',
      applicationDate: '2018-11-22',
      status: 'Expired',
      files: [],
    },
  ],

  // ── Iteration Records ────────────────────────────────────────────────────
  iterationRecords: [
    {
      id: 'ir-01',
      timestamp: '2024-11-05 14:32',
      operator: 'Xiaomei Li',
      operatorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=XL&backgroundColor=3b82f6&fontColor=ffffff',
      field: 'Stage',
      description: 'Stage updated from Concept to Finished',
      from: 'Concept', to: 'Finished',
    },
    {
      id: 'ir-02',
      timestamp: '2024-10-28 09:15',
      operator: 'Wei Zhang',
      operatorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=WZ&backgroundColor=10b981&fontColor=ffffff',
      field: 'QC Attachments',
      description: 'Uploaded EN71 Compliance Certificate',
    },
    {
      id: 'ir-03',
      timestamp: '2024-10-22 16:44',
      operator: 'Wei Zhang',
      operatorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=WZ&backgroundColor=10b981&fontColor=ffffff',
      field: 'QC Attachments',
      description: 'Uploaded ASTM F963 test report',
    },
    {
      id: 'ir-04',
      timestamp: '2024-10-15 11:08',
      operator: 'Sarah Thompson',
      operatorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ST&backgroundColor=f59e0b&fontColor=ffffff',
      field: 'Initial Selection',
      description: 'Initial Selection changed from Walmart to Dollar Tree',
      from: 'Walmart', to: 'Dollar Tree',
    },
    {
      id: 'ir-05',
      timestamp: '2024-10-08 15:22',
      operator: 'Xiaomei Li',
      operatorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=XL&backgroundColor=3b82f6&fontColor=ffffff',
      field: 'Cost',
      description: 'Dollar Purchase updated; Ningbo Comments revised',
      from: '$0.490', to: '$0.527',
    },
    {
      id: 'ir-06',
      timestamp: '2024-09-30 10:00',
      operator: 'Sarah Thompson',
      operatorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ST&backgroundColor=f59e0b&fontColor=ffffff',
      field: 'Product Info',
      description: 'Product name updated; spec and packaging quantities added',
    },
    {
      id: 'ir-07',
      timestamp: '2024-09-18 09:30',
      operator: 'System',
      operatorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SYS&backgroundColor=64748b&fontColor=ffffff',
      field: 'System',
      description: 'Item PDM-20241001-138 created with initial stage: Concept',
    },
  ],
}
