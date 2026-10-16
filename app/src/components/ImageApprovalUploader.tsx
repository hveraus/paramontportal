import { useState, type ChangeEvent } from 'react'
import type { ApprovalImageItem, ProductImage } from '../types'
import { useApprovals } from '../context/approvalStore'
import { useRole } from '../context/RoleContext'
import { useNavigation } from '../context/NavigationContext'

interface Props {
  productCode: string
  productName: string
  images: ProductImage[]
}

const IMAGE_TYPES: ProductImage['type'][] = ['Product Render', 'Packaging Render', 'Reference Images']

function readImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error(`Could not read ${file.name}`))
    reader.readAsDataURL(file)
  })
}

export default function ImageApprovalUploader({ productCode, productName, images }: Props) {
  const { currentUser } = useRole()
  const { navigate } = useNavigation()
  const { requests, submitImage } = useApprovals()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<ApprovalImageItem[]>([])
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const pending = requests.filter(r => r.kind === 'image' && r.productCode === productCode
    && r.requesterId === currentUser.id && r.status === 'pending')

  async function chooseFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (!files.length) return
    const invalid = files.find(file => !file.type.startsWith('image/') || file.size > 10 * 1024 * 1024)
    if (invalid) { setMessage(`${invalid.name}: choose an image smaller than 10 MB.`); return }
    setBusy(true)
    setMessage('')
    try {
      const next = await Promise.all(files.map(async file => ({
        id: `image-${crypto.randomUUID()}`,
        fileName: file.name,
        imageUrl: await readImage(file),
        imageType: 'Product Render' as ProductImage['type'],
      })))
      setItems(previous => [...previous, ...next])
    } catch { setMessage('Some images could not be read. Please select them again.') }
    finally { setBusy(false) }
  }

  function updateItem(id: string, fields: Partial<ApprovalImageItem>) {
    setItems(previous => previous.map(item => item.id === id ? { ...item, ...fields } : item))
  }

  function submit() {
    if (!items.length || busy) return
    const id = submitImage({ productCode, productName, requesterId: currentUser.id, images: items })
    if (!id) { setMessage('No department manager found for this account in the mock Feishu directory.'); return }
    setOpen(false)
    setItems([])
    setMessage(`${items.length} ${items.length === 1 ? 'image' : 'images'} submitted in one approval request. Your department manager has a simulated Feishu notification.`)
  }

  function close() {
    setOpen(false)
    setItems([])
    setMessage('')
  }

  return <>
    <div className="flex items-center justify-between gap-2 mt-3">
      <button type="button" onClick={() => { setOpen(true); setMessage('') }} className="text-xs font-semibold text-blue-700 hover:text-blue-800 border border-blue-200 bg-blue-50 rounded-lg px-3 py-2">Upload or replace images</button>
      {pending.length > 0 && <button type="button" onClick={() => navigate('approvals')} className="text-xs text-amber-700 hover:underline">{pending.length} pending {pending.length === 1 ? 'request' : 'requests'}</button>}
    </div>
    {message && !open && <p role="status" className="text-xs text-slate-600 mt-2">{message}</p>}
    {open && <div className="fixed inset-0 z-[60] bg-slate-950/40 flex items-center justify-center p-4" onMouseDown={event => { if (event.target === event.currentTarget) close() }}>
      <div role="dialog" aria-modal="true" aria-label="Submit images for approval" className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Submit images for approval</h2>
          <p className="text-sm text-slate-500 mt-1">All selected images go into one request and are approved or rejected together. Existing images remain visible until approval.</p>
        </div>
        <label className="block text-sm font-medium text-slate-700">Choose images
          <input type="file" accept="image/*" multiple onChange={chooseFiles} disabled={busy} className="block w-full mt-1.5 text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-blue-700" />
        </label>
        {items.length > 0 && <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-3 py-2 bg-slate-50 text-xs font-semibold text-slate-600">{items.length} {items.length === 1 ? 'image' : 'images'} in this request</div>
          <div className="max-h-[45vh] overflow-y-auto divide-y divide-slate-100">
            {items.map((item, index) => <div key={item.id} className="flex gap-3 p-3">
              <img src={item.imageUrl} alt={item.fileName} className="w-16 h-16 rounded-lg border border-slate-200 object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-slate-800 truncate" title={item.fileName}>{index + 1}. {item.fileName}</p>
                  <button type="button" onClick={() => setItems(previous => previous.filter(other => other.id !== item.id))} className="text-xs text-slate-400 hover:text-rose-600" aria-label={`Remove ${item.fileName}`}>Remove</button>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <select aria-label={`Image type for ${item.fileName}`} value={item.imageType} onChange={event => updateItem(item.id, { imageType: event.target.value as ProductImage['type'] })} className="min-w-0 px-2 py-1.5 rounded-md border border-slate-200 bg-white text-xs">
                    {IMAGE_TYPES.map(value => <option key={value}>{value}</option>)}
                  </select>
                  <select aria-label={`Replace image for ${item.fileName}`} value={item.replaceImageId ?? ''} onChange={event => updateItem(item.id, { replaceImageId: event.target.value || undefined })} className="min-w-0 px-2 py-1.5 rounded-md border border-slate-200 bg-white text-xs">
                    <option value="">Add new image</option>
                    {images.map((image, imageIndex) => <option key={image.id} value={image.id} disabled={items.some(other => other.id !== item.id && other.replaceImageId === image.id)}>{image.type} · Image {imageIndex + 1}</option>)}
                  </select>
                </div>
              </div>
            </div>)}
          </div>
        </div>}
        {message && <p role="alert" className="text-xs text-rose-600">{message}</p>}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={close} className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600">Cancel</button>
          <button type="button" onClick={submit} disabled={!items.length || busy} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold disabled:opacity-40">{busy ? 'Reading images…' : `Submit ${items.length || ''} for approval`}</button>
        </div>
      </div>
    </div>}
  </>
}
