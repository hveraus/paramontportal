export type ProductStatus = 'Concept' | 'Proposed' | 'Pre-selected' | 'Initial Sampled' | 'Production' | 'Dropped'
export type ParentOrBaby  = 'Parent' | 'Baby'
export type AgeGrade      = '3+' | '6+' | '8+' | '14+'
export type FobPoint      = 'Ningbo' | 'Shenzhen' | 'Huzhiming' | 'Haiphong' | 'Shanghai'
export type BorderDomestic = 'Domestic' | 'Direct Import'

export type QualityStatus = 'PASS' | 'FAIL' | 'PENDING'

export interface QualityRecord {
  id: string
  qualityStatus: QualityStatus
  qualityDate: string | null
  qualityOwner: TeamMember | null
  failReason?: string
  attachments: QualityAttachment[]
  images: ProductImage[]
}

export type PatentStatus = 'Pending' | 'Granted' | 'Expired'

export interface PatentFile {
  id: string
  name: string
  url: string
  size: string
  uploadedAt: string
}

export interface PatentRecord {
  id: string
  patentName: string
  patentNumber: string
  applicationDate: string | null
  status: PatentStatus | null
  files: PatentFile[]
}

export type CertificationType = 'CE' | 'FCC' | 'RoHS' | 'Other'

export interface CertificationFile {
  id: string
  name: string
  url: string
  size: string
  uploadedAt: string
}

export interface CertificationRecord {
  id: string
  certType: CertificationType
  certNumber: string
  certDate: string | null
  expiryDate: string | null
  files: CertificationFile[]
}

export type UserRole =
  | 'admin'
  | 'product_manager'
  | 'pd_china'
  | 'pd_us'
  | 'sales'

export interface TeamMember {
  id: string
  name: string
  avatar: string
  team: 'China' | 'US'
}

export interface ProductImage {
  id: string
  url: string
  type: 'Product Render' | 'Packaging Render' | 'Reference Images'
  alt: string
}

export interface SourceFile {
  id: string
  name: string
  size: string          // e.g. "4.2 MB"
  uploadedAt: string    // ISO date
  uploadedBy: string
}

export interface QualityAttachment {
  id: string
  name: string
  url: string
  type: 'PDF' | 'DOC' | 'IMG'
  size: string
  uploadedAt: string
  uploadedBy: string
}

export interface IterationRecord {
  id: string
  timestamp: string
  operator: string
  operatorAvatar: string
  field: string
  description: string
  from?: string
  to?: string
}

export type CommentTeam = 'US' | 'NB'

export interface ProductComment {
  id: string
  date: string
  authorId: string
  authorName: string
  authorAvatar: string
  team: CommentTeam
  content: string
}

export interface ProductDetail {
  // ── Basic Info ──────────────────────────────────────────────────
  productCode: string           // 产品编码  PDM-YYYYMMDD-XXX
  itemNo: string                // ITEM# Primary Key
  upc: string | null            // UPC#
  upc12Digit: string | null     // 12 Digit UPC
  productName: string           // 产品名称
  categoryPath: string[]        // 品类 (三级)
  productCategory: string       // Product Category
  brand: string                 // Brand
  status: ProductStatus         // 状态
  parentOrBaby: ParentOrBaby | null
  parentNumber: string | null
  creatingTeam: 'China' | 'US'
  initialSelection: string
  committed: boolean | null
  itemDataFinalized: boolean | null
  borderDomestic: BorderDomestic | null
  createdAt: string
  updatedAt: string
  designers: TeamMember[]
  designDueDate: string | null
  nbSourcing: TeamMember | null
  nbPd: TeamMember | null
  itemDescription: string       // 描述 / Features & Benefits (rich text)
  solComments: string | null    // Comments from SOL
  productSpec: string | null    // Product Spec
  itemPackagingSpec: string | null
  materialBreakdown: string | null
  assortmentBreakdown: string | null
  ageGrade: AgeGrade | null
  fobPoint: FobPoint | null
  factoryName: string | null
  estOrderQty: number | null

  // ── Comment thread ──────────────────────────────────────────────
  comments: ProductComment[]

  // ── Specs ───────────────────────────────────────────────────────
  itemHeight: number | null        // inch
  itemWidth: number | null         // inch
  itemDepth: number | null         // inch
  itemWeightG: number | null       // g
  innerHeight: number | null       // inch
  innerWidth: number | null        // inch
  innerDepth: number | null        // inch
  innerWeightLbs: number | null    // lbs
  masterHeight: number | null      // inch
  masterWidth: number | null       // inch
  masterDepth: number | null       // inch
  grossWeightKg: number | null     // kg
  netWeightKg: number | null       // kg

  // ── Packaging ───────────────────────────────────────────────────
  countPerPackage: number
  masterQty: number
  innerQty: number
  packagingType: string
  packagingMaterial: string
  upcCode: string

  // ── Quality ─────────────────────────────────────────────────────
  qualityRecords: QualityRecord[]

  // ── Cost ────────────────────────────────────────────────────────
  costReadyDate: string | null
  retail: number | null
  rmbPurchase: number | null
  dollarPurchase: number | null
  estPlatingMoldingCost: number | null   // CNY
  nbSuggestedCogs: number | null
  finalizedCogsNb: number | null
  totalCogs: number | null
  nbGpPercent: number | null
  pgusMargin: number | null
  fobNbWithPgusMargin: number | null
  customerCommission: number | null
  diFreightRate: number | null
  doFreightRate: number | null
  texasWarehouseCost: number | null
  declarationPrice: number | null
  dutyCost: number | null

  // ── DI Pricing ───────────────────────────────────────────────────
  diNetFirstFobNbWCommission: number | null
  diFirstFobPriceWithC: number | null
  diLandingCost: number | null
  diCustomerImu: number | null

  // ── DO Pricing ───────────────────────────────────────────────────
  texasWarehouseCostRatio: number | null
  newDoFirstFobTexas: number | null
  newDoNetFirstCost: number | null
  newDoImu: number | null
  newDoTexasImu: number | null

  // ── Summary ──────────────────────────────────────────────────────
  totalFob: number | null
  combinedGpPercent: number | null

  // ── Customs ─────────────────────────────────────────────────────
  htsCategory: string
  htsCode: string
  dutyPercent: number | null
  dutyDollar: number | null
  tariff: string | null
  extraTariff15: number | null
  totalDutyRate: number | null
  defectiveAllowance: number | null
  countryOfOrigin: string

  // ── Images ──────────────────────────────────────────────────────
  images: ProductImage[]
  sourceFiles: SourceFile[]

  // ── Certifications ───────────────────────────────────────────────
  certifications: CertificationRecord[]

  // ── Patents ──────────────────────────────────────────────────────
  patents: PatentRecord[]

  // ── Iteration records ────────────────────────────────────────────
  iterationRecords: IterationRecord[]

  // ── Committed projects ───────────────────────────────────────────
  committedRecords: CommittedRecord[]

  // ── PD Notes ─────────────────────────────────────────────────────
  pdComments: string | null
  nbPdComments: string | null
}

export interface CommittedRecord {
  id: string
  committedDate: string       // ISO date string  入选日期
  projectName: string         // 入选项目名称
  programCode: string         // Program code
  projectId: string           // for deep-link to project page
  customer: string            // 客户名称 (sourced from external system)
  clientPending?: boolean     // true = pending fetch from external system
}

// ── Sample Room ───────────────────────────────────────────────────────────────

export interface LocationNode {
  id: string
  name: string
  levelIndex: number   // depth in tree (0 = root level)
  parentId: string | null
  order: number
  isLeaf: boolean      // true when levelIndex === schema.levels.length - 1
  createdAt: string
}

export interface SampleAssignment {
  id: string
  positionId: string   // LocationNode.id where isLeaf===true
  productId: string    // matches MOCK_PRODUCTS[n].id
  assignedAt: string
  assignedBy: string
  notes?: string
}

export interface LocationSchema {
  levels: Array<{ label: string }>  // user-defined level names; length = number of levels (1-8)
}

// ── Archive files ────────────────────────────────────────────────────────────

export type ArchiveFileType = 'pdf' | 'ppt' | 'pptx'

export interface ArchiveUploader {
  id: string
  name: string
  avatar: string
}

export interface ArchiveFile {
  id: string
  name: string
  type: ArchiveFileType
  sizeBytes: number          // raw bytes for sorting
  sizeLabel: string          // e.g. "2.4 MB"
  uploadedAt: string         // ISO date string (YYYY-MM-DD)
  uploadedBy: ArchiveUploader
  url: string                // preview / download href
  customer: string           // L1 folder — e.g. "Walmart"
  year: number               // L2 folder — e.g. 2026
  department: string         // L3 folder — e.g. "D92"
  event: string              // L4 folder — e.g. "Q1 Valentines Baking"
}
