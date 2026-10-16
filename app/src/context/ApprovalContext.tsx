import { useState, type ReactNode } from 'react'
import type { ApprovalRequest, ProductImage } from '../types'
import { canReviewRequest, getFeishuMember, resolveDepartmentManager } from '../mock/feishuOrg'
import { MOCK_APPROVALS } from '../mock/approvals'
import { ApprovalContext, type SubmitDownloadInput, type SubmitImageInput } from './approvalStore'

export function ApprovalProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<ApprovalRequest[]>(() => MOCK_APPROVALS)

  function createRequest(input: SubmitImageInput | SubmitDownloadInput, kind: ApprovalRequest['kind'], reason?: string) {
    const requester = getFeishuMember(input.requesterId)
    const approver = resolveDepartmentManager(input.requesterId)
    if (!requester || !approver) return null
    const request: ApprovalRequest = {
      id: `approval-${crypto.randomUUID()}`,
      kind,
      status: 'pending',
      productCode: input.productCode,
      productName: input.productName,
      requesterId: requester.id,
      requesterName: requester.name,
      departmentId: requester.departmentId,
      approverId: approver.id,
      approverName: approver.name,
      submittedAt: new Date().toISOString(),
      reviewedAt: null,
      ...(kind === 'image' ? {
        images: (input as SubmitImageInput).images,
      } : { reason }),
    }
    setRequests(prev => [request, ...prev])
    return request.id
  }

  const submitImage = (input: SubmitImageInput) => input.images.length > 0 ? createRequest(input, 'image') : null
  const submitDownload = (input: SubmitDownloadInput) => {
    if (requests.some(r => r.kind === 'download' && r.requesterId === input.requesterId
      && r.productCode === input.productCode && (r.status === 'pending' || r.status === 'approved'))) return null
    return createRequest(input, 'download', input.reason)
  }

  function reviewMany(ids: string[], reviewerId: string, decision: 'approved' | 'rejected') {
    const selected = new Set(ids)
    const eligible = requests.filter(r => selected.has(r.id) && r.status === 'pending'
      && canReviewRequest(reviewerId, r.requesterId, r.approverId))
    if (!eligible.length) return 0
    const eligibleIds = new Set(eligible.map(r => r.id))
    const reviewedAt = new Date().toISOString()
    setRequests(prev => prev.map(r => eligibleIds.has(r.id)
      ? { ...r, status: decision, reviewedAt }
      : r))
    return eligible.length
  }

  const review = (id: string, reviewerId: string, decision: 'approved' | 'rejected') =>
    reviewMany([id], reviewerId, decision) === 1

  const canDownload = (userId: string, productCode: string) => requests.some(r =>
    r.kind === 'download' && r.requesterId === userId && r.productCode === productCode && r.status === 'approved')
  const pendingDownload = (userId: string, productCode: string) => requests.some(r =>
    r.kind === 'download' && r.requesterId === userId && r.productCode === productCode && r.status === 'pending')

  function effectiveImages(productCode: string, originals: ProductImage[]) {
    const approved = requests.filter(r => r.kind === 'image' && r.status === 'approved'
      && r.productCode === productCode && r.images?.length).reverse()
    return approved.flatMap(r => r.images ?? []).reduce<ProductImage[]>((images, item) => {
      const image: ProductImage = { id: item.id, url: item.imageUrl, type: item.imageType, alt: item.fileName }
      if (item.replaceImageId) {
        const index = images.findIndex(existing => existing.id === item.replaceImageId)
        if (index >= 0) return images.map((existing, i) => i === index ? { ...image, id: item.replaceImageId! } : existing)
      }
      return [...images, image]
    }, originals)
  }

  return <ApprovalContext.Provider value={{ requests, submitImage, submitDownload, review, reviewMany, canDownload, pendingDownload, effectiveImages }}>
    {children}
  </ApprovalContext.Provider>
}
