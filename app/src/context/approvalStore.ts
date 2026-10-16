import { createContext, useContext } from 'react'
import type { ApprovalImageItem, ApprovalRequest, ProductImage } from '../types'

export interface SubmitImageInput {
  productCode: string
  productName: string
  requesterId: string
  images: ApprovalImageItem[]
}

export interface SubmitDownloadInput {
  productCode: string
  productName: string
  requesterId: string
  reason: string
}

export interface ApprovalContextValue {
  requests: ApprovalRequest[]
  submitImage: (input: SubmitImageInput) => string | null
  submitDownload: (input: SubmitDownloadInput) => string | null
  review: (id: string, reviewerId: string, decision: 'approved' | 'rejected') => boolean
  reviewMany: (ids: string[], reviewerId: string, decision: 'approved' | 'rejected') => number
  canDownload: (userId: string, productCode: string) => boolean
  pendingDownload: (userId: string, productCode: string) => boolean
  effectiveImages: (productCode: string, originals: ProductImage[]) => ProductImage[]
}

export const ApprovalContext = createContext<ApprovalContextValue | null>(null)

export function useApprovals() {
  const context = useContext(ApprovalContext)
  if (!context) throw new Error('useApprovals must be inside ApprovalProvider')
  return context
}
