import { useState } from 'react'
import { useApprovals } from '../context/approvalStore'
import { useRole } from '../context/RoleContext'
import { useNavigation } from '../context/NavigationContext'

interface Props {
  productCode: string
  productName: string
  fileName: string
  fileUrl?: string
  className?: string
  label?: string
}

export default function DownloadApprovalButton({ productCode, productName, fileName, fileUrl, className = '', label = 'Download' }: Props) {
  const { currentUser } = useRole()
  const { navigate } = useNavigation()
  const { requests, canDownload, pendingDownload, submitDownload } = useApprovals()
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [message, setMessage] = useState('')
  const granted = canDownload(currentUser.id, productCode)
  const pending = pendingDownload(currentUser.id, productCode)
  const history = [...new Set(requests.filter(r => r.kind === 'download' && r.requesterId === currentUser.id && r.reason).map(r => r.reason!))]

  function handleClick() {
    if (granted) {
      if (fileUrl && fileUrl !== '#') {
        const anchor = document.createElement('a')
        anchor.href = fileUrl
        anchor.download = fileName
        document.body.appendChild(anchor)
        anchor.click()
        anchor.remove()
      } else {
        setMessage('Download approved. This demo has no stored binary for this file.')
      }
      return
    }
    if (pending) { navigate('approvals'); return }
    setMessage('')
    setOpen(true)
  }

  function submit() {
    if (!reason.trim()) return
    const id = submitDownload({ productCode, productName, requesterId: currentUser.id, reason: reason.trim() })
    if (!id) { setMessage('No department manager found, or product download access is already pending or approved.'); return }
    setOpen(false)
    setReason('')
    setMessage('Product download access requested. Once approved, you can download every file under this product. A Feishu notification is simulated.')
  }

  return <>
    <button type="button" onClick={handleClick} className={className} title={pending ? 'View pending request' : granted ? 'Download approved' : 'Request download approval'}>
      {pending && label === 'Download' ? 'Pending approval' : label}
    </button>
    {message && <div role="status" className="fixed bottom-5 right-5 z-[70] max-w-sm bg-slate-900 text-white text-sm px-4 py-3 rounded-xl shadow-xl flex gap-3 items-start">
      <span>{message}</span><button onClick={() => setMessage('')} aria-label="Dismiss" className="text-slate-300 hover:text-white">×</button>
    </div>}
    {open && <div className="fixed inset-0 z-[60] bg-slate-950/40 flex items-center justify-center p-4" onMouseDown={e => { if (e.target === e.currentTarget) setOpen(false) }}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-4" role="dialog" aria-modal="true" aria-label="Request download approval">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Request product download access</h2>
          <p className="text-sm text-slate-500 mt-1">You selected {fileName}. This application covers the whole product.</p>
        </div>
        <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2 text-sm text-slate-700">
          <p className="font-medium">{productName}</p>
          <p className="text-xs text-slate-500 mt-0.5">{productCode}</p>
        </div>
        <p className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2.5 text-sm text-blue-800">
          Once approved, you can download all files under this product, including Art Works, quality PDFs, and patent PDFs. You only need one approval for this product.
        </p>
        {history.length > 0 && <div>
          <p className="text-xs font-medium text-slate-500 mb-1.5">Previous reasons</p>
          <div className="flex flex-wrap gap-1.5">{history.map(item => <button key={item} type="button" onClick={() => setReason(item)} className="max-w-full truncate text-xs px-2.5 py-1.5 rounded-full border border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100">{item}</button>)}</div>
        </div>}
        <label className="block text-sm font-medium text-slate-700">Reason for download
          <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} placeholder="Describe why you need the files" className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </label>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600">Cancel</button>
          <button type="button" onClick={submit} disabled={!reason.trim()} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold disabled:opacity-40">Submit request</button>
        </div>
      </div>
    </div>}
  </>
}
