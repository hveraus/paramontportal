export type ProductStatus = 'Concept' | 'Proposed' | 'Pre-selected' | 'Initial Sampled' | 'Final' | 'Dropped'
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
  owner: TeamMember
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

  // ── Certifications ───────────────────────────────────────────────
  certifications: CertificationRecord[]

  // ── Patents ──────────────────────────────────────────────────────
  patents: PatentRecord[]

  // ── Iteration records ────────────────────────────────────────────
  iterationRecords: IterationRecord[]
}
