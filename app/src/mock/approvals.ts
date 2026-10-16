import type { ApprovalImageItem, ApprovalKind, ApprovalRequest, ApprovalStatus, ProductImage } from '../types'
import { getFeishuMember, resolveDepartmentManager } from './feishuOrg'

const PRODUCT_CODE = 'PDM-20241001-138'
const PRODUCT_NAME = 'Pom-Pom Yarn Craft Kit – Rainbow 12pc'
const IMAGE_BASE = import.meta.env.BASE_URL

function minutesAgo(minutes: number) {
  return new Date(Date.now() - minutes * 60_000).toISOString()
}

function makeRequest(
  id: string,
  kind: ApprovalKind,
  status: ApprovalStatus,
  requesterId: string,
  fileName: string,
  minutes: number,
  details: {
    productCode?: string
    productName?: string
    images?: ApprovalImageItem[]
    imageUrl?: string
    imageType?: ProductImage['type']
    replaceImageId?: string
    reason?: string
  } = {},
): ApprovalRequest {
  const requester = getFeishuMember(requesterId)
  const approver = resolveDepartmentManager(requesterId)
  if (!requester || !approver) throw new Error(`Invalid mock approval requester: ${requesterId}`)
  return {
    id, kind, status,
    productCode: details.productCode ?? PRODUCT_CODE,
    productName: details.productName ?? PRODUCT_NAME,
    requesterId: requester.id,
    requesterName: requester.name,
    departmentId: requester.departmentId,
    approverId: approver.id,
    approverName: approver.name,
    submittedAt: minutesAgo(minutes),
    reviewedAt: status === 'pending' ? null : minutesAgo(Math.max(1, minutes - 45)),
    ...(kind === 'image' ? {
      images: details.images ?? [{
        id: `${id}-image-1`,
        fileName,
        imageUrl: details.imageUrl ?? '',
        imageType: details.imageType ?? 'Product Render',
        replaceImageId: details.replaceImageId,
      }],
    } : { reason: details.reason }),
  }
}

// Seeded requests make each status and both reviewer / submitter views usable
// before anyone creates a new request in the demo.
export const MOCK_APPROVALS: ApprovalRequest[] = [
  // Sarah is the default signed-in user. Her requests populate My Requests,
  // while Josh and Mike's requests continue to populate her To Review list.
  makeRequest('mock-my-img-01', 'image', 'pending', 'u-sarah', '2 images', 18, {
    images: [
      { id: 'mock-my-img-01-a', fileName: 'Rainbow_Kit_Hero_New.webp', imageUrl: `${IMAGE_BASE}box.webp`, imageType: 'Product Render' },
      { id: 'mock-my-img-01-b', fileName: 'Rainbow_Kit_Side_View.jpg', imageUrl: `${IMAGE_BASE}Turtle.jpg`, imageType: 'Product Render' },
    ],
  }),
  makeRequest('mock-my-img-02', 'image', 'approved', 'u-sarah', 'Rainbow_Kit_Display.webp', 1800, {
    imageUrl: `${IMAGE_BASE}box.webp`, imageType: 'Packaging Render',
  }),
  makeRequest('mock-my-img-03', 'image', 'rejected', 'u-sarah', 'Rainbow_Kit_Old_Concept.jpg', 4400, {
    imageUrl: `${IMAGE_BASE}Turtle.jpg`, imageType: 'Reference Images',
  }),
  makeRequest('mock-my-dl-01', 'download', 'pending', 'u-sarah', 'Rainbow_Kit_Artwork_Final.ai', 48, {
    productCode: 'PDM-20241001-140',
    productName: 'Spring Paper Craft Set',
    reason: 'Prepare the artwork for the upcoming customer review.',
  }),
  makeRequest('mock-my-dl-02', 'download', 'approved', 'u-sarah', 'QC_Test_Report.pdf', 2020, {
    productCode: 'PDM-20241001-139',
    productName: 'Pastel Bead Craft Kit',
    reason: 'Share the quality report with the product team.',
  }),
  makeRequest('mock-my-dl-03', 'download', 'rejected', 'u-sarah', 'Patent_Grant_Certificate.pdf', 5100, {
    reason: 'Review patent documentation for the new packaging.',
  }),
  makeRequest('mock-img-batch', 'image', 'pending', 'u-josh', '2 images', 12, {
    images: [
      { id: 'mock-img-batch-1', fileName: 'Rainbow_Kit_Angle_1.jpg', imageUrl: `${IMAGE_BASE}Turtle.jpg`, imageType: 'Product Render' },
      { id: 'mock-img-batch-2', fileName: 'Rainbow_Kit_Packaging.webp', imageUrl: `${IMAGE_BASE}box.webp`, imageType: 'Packaging Render' },
    ],
  }),
  makeRequest('mock-img-01', 'image', 'pending', 'u-josh', 'Rainbow_Kit_Front_v4.webp', 22, {
    imageUrl: `${IMAGE_BASE}box.webp`, imageType: 'Product Render', replaceImageId: 'img-01',
  }),
  makeRequest('mock-img-02', 'image', 'pending', 'u-mike', 'Packaging_Back_Revision.webp', 68, {
    imageUrl: `${IMAGE_BASE}box.webp`, imageType: 'Packaging Render', replaceImageId: 'img-03',
  }),
  makeRequest('mock-img-03', 'image', 'approved', 'u-josh', 'Rainbow_Kit_Lifestyle.jpg', 1540, {
    imageUrl: `${IMAGE_BASE}Turtle.jpg`, imageType: 'Reference Images',
  }),
  makeRequest('mock-img-04', 'image', 'rejected', 'u-mike', 'Old_Packaging_Concept.webp', 2950, {
    imageUrl: `${IMAGE_BASE}box.webp`, imageType: 'Packaging Render',
  }),
  makeRequest('mock-dl-01', 'download', 'pending', 'u-josh', 'Diamond_Art_Kit_Packaging_v3.ai', 37, {
    reason: 'Share packaging artwork with the customer for review.',
  }),
  makeRequest('mock-dl-02', 'download', 'approved', 'u-mike', 'US11234567-Grant-Certificate.pdf', 1630, {
    reason: 'Prepare a patent summary for the buyer meeting.',
  }),
  makeRequest('mock-dl-03', 'download', 'rejected', 'u-josh', 'Diamond_Art_Kit_Dieline_v2.ai', 4200, {
    reason: 'Review production die lines with the factory.',
  }),
  makeRequest('mock-img-05', 'image', 'pending', 'u-xiaomei', 'Yarn_Color_Swatch.jpg', 91, {
    imageUrl: `${IMAGE_BASE}Turtle.jpg`, imageType: 'Reference Images',
  }),
  makeRequest('mock-img-06', 'image', 'approved', 'u-xiaomei', 'Packaging_Render_Final.webp', 3080, {
    imageUrl: `${IMAGE_BASE}box.webp`, imageType: 'Packaging Render',
  }),
  makeRequest('mock-dl-04', 'download', 'pending', 'u-xiaomei', 'QC_Test_Report.pdf', 54, {
    reason: 'Send the quality report to the compliance team.',
  }),
  makeRequest('mock-dl-05', 'download', 'rejected', 'u-xiaomei', 'CN202310456789-Application.pdf', 4800, {
    reason: 'Compare the patent application with the latest sample.',
  }),
]
