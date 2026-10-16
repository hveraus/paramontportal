import { useState } from 'react'
import type { ApprovalImageItem, ApprovalKind, ApprovalStatus } from '../types'
import { useApprovals } from '../context/approvalStore'
import { useRole } from '../context/RoleContext'
import { useNavigation } from '../context/NavigationContext'
import TopBar from '../components/TopBar'
import Sidebar from '../components/Sidebar'

const STATUS_LABELS: Record<ApprovalStatus, string> = {
  pending: 'Pending', approved: 'Approved', rejected: 'Rejected',
}
const STATUS_STYLES: Record<ApprovalStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200',
}

export default function ApprovalsPage() {
  const { currentUser } = useRole()
  const { navigate } = useNavigation()
  const { requests, review, reviewMany } = useApprovals()
  const [kind, setKind] = useState<ApprovalKind>('image')
  const [view, setView] = useState<'review' | 'mine'>('review')
  const [status, setStatus] = useState<ApprovalStatus | 'all'>('pending')
  const [preview, setPreview] = useState<ApprovalImageItem | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const visible = requests.filter(request => request.kind === kind
    && (view === 'review' ? request.approverId === currentUser.id && request.requesterId !== currentUser.id : request.requesterId === currentUser.id)
    && (status === 'all' || request.status === status))
  const pendingCount = requests.filter(request => request.approverId === currentUser.id
    && request.requesterId !== currentUser.id && request.status === 'pending').length
  const selectable = view === 'review' ? visible.filter(request => request.status === 'pending') : []
  const selectedCount = selectable.filter(request => selectedIds.includes(request.id)).length
  const allSelected = selectable.length > 0 && selectedCount === selectable.length

  function toggleSelection(id: string) {
    setSelectedIds(previous => previous.includes(id) ? previous.filter(value => value !== id) : [...previous, id])
  }

  function handleBulkReview(decision: 'approved' | 'rejected') {
    reviewMany(selectable.filter(request => selectedIds.includes(request.id)).map(request => request.id), currentUser.id, decision)
    setSelectedIds([])
  }

  return <div className="min-h-screen bg-slate-100">
    <TopBar />
    <div className="flex">
      <Sidebar topOffset={56} />
      <main className="flex-1 min-w-0 px-7 py-7">
        <div className="max-w-6xl mx-auto space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-1">Workflow</p>
              <h1 className="text-2xl font-bold text-slate-900">Approval Requests</h1>
              <p className="text-sm text-slate-500 mt-1">Image uploads and product-wide file download access · Feishu organization demo</p>
            </div>
            <span className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700">
              {pendingCount} awaiting my review
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 pt-5 border-b border-slate-100">
              <div className="flex gap-6">
                {([['image', 'Image Uploads'], ['download', 'File Downloads']] as const).map(([value, label]) => <button
                  key={value} onClick={() => { setSelectedIds([]); setKind(value); setStatus(view === 'review' ? 'pending' : 'all') }}
                  className={`pb-3 text-sm font-medium border-b-2 ${kind === value ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >{label}</button>)}
              </div>
            </div>
            <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex rounded-lg bg-slate-100 p-1 gap-1">
                {([['review', 'To Review'], ['mine', 'My Requests']] as const).map(([value, label]) => <button
                  key={value} onClick={() => { setSelectedIds([]); setView(value); setStatus(value === 'review' ? 'pending' : 'all') }}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-md ${view === value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                >{label}</button>)}
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {(['all', 'pending', 'approved', 'rejected'] as const).map(value => <button
                  key={value} onClick={() => { setSelectedIds([]); setStatus(value) }}
                  className={`text-xs px-3 py-1.5 rounded-full border ${status === value ? 'bg-blue-50 border-blue-200 text-blue-700 font-semibold' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >{value === 'all' ? 'All' : STATUS_LABELS[value]}</button>)}
              </div>
            </div>

            {view === 'review' && selectedCount > 0 && <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-blue-50 border-t border-blue-100">
              <span className="text-sm font-medium text-blue-800">{selectedCount} {selectedCount === 1 ? 'request' : 'requests'} selected</span>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setSelectedIds([])} className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1.5">Clear</button>
                <button type="button" onClick={() => handleBulkReview('rejected')} className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-xs font-medium text-slate-700 hover:bg-rose-50 hover:text-rose-700">Reject selected</button>
                <button type="button" onClick={() => handleBulkReview('approved')} className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700">Approve selected</button>
              </div>
            </div>}

            {visible.length === 0 ? <div className="py-20 text-center text-sm text-slate-400 border-t border-slate-100">
              No {kind === 'image' ? 'image' : 'download'} requests in this list.
            </div> : <div className="overflow-x-auto border-t border-slate-100">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    {view === 'review' && <th className="pl-5 py-3 w-10">
                      {selectable.length > 0 && <input type="checkbox" aria-label="Select all pending requests" checked={allSelected} onChange={() => setSelectedIds(allSelected ? [] : selectable.map(request => request.id))} className="w-4 h-4 rounded border-slate-300 accent-blue-600 cursor-pointer" />}
                    </th>}
                    <th className="px-5 py-3 font-semibold">Product</th>
                    <th className="px-5 py-3 font-semibold">{kind === 'image' ? 'Images in Request' : 'Access Scope'}</th>
                    <th className="px-5 py-3 font-semibold">{view === 'review' ? 'Submitted by' : 'Approver'}</th>
                    <th className="px-5 py-3 font-semibold">Submitted</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    {view === 'review' && <th className="px-5 py-3 font-semibold text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visible.map(request => <tr key={request.id} className="hover:bg-slate-50/60 align-top">
                    {view === 'review' && <td className="pl-5 py-4 w-10">
                      {request.status === 'pending' && <input type="checkbox" aria-label={`Select request for ${request.productName} from ${request.requesterName}`} checked={selectedIds.includes(request.id)} onChange={() => toggleSelection(request.id)} className="w-4 h-4 rounded border-slate-300 accent-blue-600 cursor-pointer" />}
                    </td>}
                    <td className="px-5 py-4 min-w-48">
                      <button onClick={() => navigate('product-detail')} className="font-semibold text-blue-700 hover:underline text-left">{request.productName}</button>
                      <p className="text-xs font-mono text-slate-400 mt-1">{request.productCode}</p>
                    </td>
                    <td className="px-5 py-4 min-w-48">
                      {kind === 'image' ? <div className="min-w-56">
                        <p className="text-xs font-semibold text-slate-500 mb-2">{request.images?.length ?? 0} {request.images?.length === 1 ? 'image' : 'images'} · one approval request</p>
                        <div className="max-h-44 overflow-y-auto space-y-1.5">
                          {request.images?.map(image => <button key={image.id} type="button" onClick={() => setPreview(image)} className="w-full flex items-center gap-2 text-left rounded-lg hover:bg-blue-50 p-1 -ml-1" title={`Preview ${image.fileName}`}>
                            <img src={image.imageUrl} alt={image.fileName} className="w-10 h-10 object-cover rounded-md border border-slate-200 flex-shrink-0" />
                            <span className="min-w-0">
                              <span className="block text-xs font-medium text-slate-700 truncate max-w-48">{image.fileName}</span>
                              <span className="block text-[11px] text-slate-400">{image.replaceImageId ? 'Replace image' : 'New image'} · {image.imageType}</span>
                            </span>
                          </button>)}
                        </div>
                      </div> : <div className="min-w-0">
                        <p className="font-medium text-slate-700">All files under this product</p>
                      </div>}
                      {request.reason && <p className="text-xs text-slate-500 mt-2">Reason: {request.reason}</p>}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{view === 'review' ? request.requesterName : request.approverName}</td>
                    <td className="px-5 py-4 text-slate-500 whitespace-nowrap">{new Date(request.submittedAt).toLocaleString()}</td>
                    <td className="px-5 py-4"><span className={`inline-flex px-2 py-1 border rounded-full text-xs font-medium ${STATUS_STYLES[request.status]}`}>{STATUS_LABELS[request.status]}</span></td>
                    {view === 'review' && <td className="px-5 py-4 text-right whitespace-nowrap">
                      {request.status === 'pending' && <div className="flex justify-end gap-2">
                        <button onClick={() => { review(request.id, currentUser.id, 'rejected'); setSelectedIds(previous => previous.filter(id => id !== request.id)) }} className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-rose-50 hover:text-rose-700">Reject</button>
                        <button onClick={() => { review(request.id, currentUser.id, 'approved'); setSelectedIds(previous => previous.filter(id => id !== request.id)) }} className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700">Approve</button>
                      </div>}
                      {request.reviewedAt && <span className="text-xs text-slate-400">{new Date(request.reviewedAt).toLocaleString()}</span>}
                    </td>}
                  </tr>)}
                </tbody>
              </table>
            </div>}
          </div>
          {preview && <div className="fixed inset-0 z-[70] bg-slate-950/80 flex items-center justify-center p-6" onClick={() => setPreview(null)} role="dialog" aria-modal="true" aria-label={`Preview ${preview.fileName}`}>
            <button type="button" onClick={() => setPreview(null)} className="absolute top-5 right-5 text-white text-2xl" aria-label="Close preview">×</button>
            <div className="max-w-full max-h-full text-center" onClick={event => event.stopPropagation()}>
              <img src={preview.imageUrl} alt={preview.fileName} className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg mx-auto" />
              <p className="text-sm text-white mt-3">{preview.fileName}</p>
            </div>
          </div>}
          <p className="text-xs text-slate-400">Demo: approver routing follows the mock Feishu directory. No real Feishu notification or server-side enforcement is connected.</p>
        </div>
      </main>
    </div>
  </div>
}
