import type { ProductDetail, TeamMember } from '../../types'

const INPUT_CLS = "w-full h-9 px-3 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-colors"
const TEXTAREA_CLS = "w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 resize-none transition-colors"
const SELECT_CLS = "w-full h-9 px-3 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-colors appearance-none"

// ── dropdown option sets ────────────────────────────────────────────────────

const PRODUCT_CATEGORY_OPTIONS = ['NB CRAFT CATEGORY', 'NB TOY CATEGORY', 'NB SEASONAL CATEGORY', 'NB STATIONERY CATEGORY']
const BRAND_OPTIONS = ['WM - Hello Hobby', 'Hello Hobby', "Crafter's Square", 'Paramont', 'Generic']
const INITIAL_SELECTION_OPTIONS = ['Dollar Tree', 'Walmart', 'Five Below', 'Target', 'Amazon']
const PRODUCT_FILING_OPTIONS = ['Filed', 'Pending', 'Not Required']
const PURCHASING_TYPE_OPTIONS = ['Domestic', 'Direct Import', 'FOB']

// Roster used to populate the people dropdowns (US PD / NB Sourcing / NB PD)
const MEMBER_ROSTER: TeamMember[] = [
  { id: 'u01', name: 'Xiaomei Li',     avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=XL&backgroundColor=3b82f6&fontColor=ffffff', team: 'China' },
  { id: 'u02', name: 'Wei Zhang',      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=WZ&backgroundColor=10b981&fontColor=ffffff', team: 'China' },
  { id: 'u05', name: 'James Park',     avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=JP&backgroundColor=8b5cf6&fontColor=ffffff', team: 'China' },
  { id: 'u06', name: 'Sarah Thompson', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ST&backgroundColor=f59e0b&fontColor=ffffff', team: 'US' },
  { id: 'u07', name: 'Emily Chen',     avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=EC&backgroundColor=ec4899&fontColor=ffffff', team: 'US' },
]

// ── helpers ──────────────────────────────────────────────────────────────

function yesNo(v: boolean | null) {
  if (v === null || v === undefined) return <span className="text-slate-300">—</span>
  return v
    ? <span className="text-emerald-600 font-medium">Yes</span>
    : <span className="text-slate-500">No</span>
}

function val(v: string | number | null | undefined, mono = false) {
  if (v === null || v === undefined || v === '') return <span className="text-slate-300">—</span>
  return <span className={mono ? 'font-mono' : ''}>{v}</span>
}

// dropdown that always includes the current value even if outside the preset list
function SelectField({ value, options, onChange }: { value: string | null; options: string[]; onChange: (v: string) => void }) {
  const opts = value && !options.includes(value) ? [value, ...options] : options
  return (
    <select className={SELECT_CLS} value={value ?? ''} onChange={e => onChange(e.target.value)}>
      <option value="">—</option>
      {opts.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

// person dropdown (single member) + read-only display
function PersonField({ member, isEditing, onChange }: { member: TeamMember | null; isEditing: boolean; onChange: (m: TeamMember | null) => void }) {
  if (isEditing) {
    return (
      <select
        className={SELECT_CLS}
        value={member?.id ?? ''}
        onChange={e => onChange(MEMBER_ROSTER.find(m => m.id === e.target.value) ?? null)}
      >
        <option value="">—</option>
        {MEMBER_ROSTER.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
      </select>
    )
  }
  if (!member) return <span className="text-slate-300">—</span>
  return (
    <div className="flex items-center gap-1.5">
      <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full flex-shrink-0" />
      <span>{member.name}</span>
    </div>
  )
}

// ── sub-components ────────────────────────────────────────────────────────

function Field({ label, children, span2 }: { label: string; children: React.ReactNode; span2?: boolean }) {
  return (
    <div className={span2 ? 'col-span-2' : ''}>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">{label}</p>
      <div className="text-sm text-slate-800">{children}</div>
    </div>
  )
}

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="col-span-2 flex items-center gap-3 pb-1">
      <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">{title}</span>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  )
}

// ── props ─────────────────────────────────────────────────────────────────

interface Props {
  product: ProductDetail
  isEditing: boolean
  onChange: (fields: Partial<ProductDetail>) => void
}

// ── main ─────────────────────────────────────────────────────────────────

export default function BasicInfoTab({ product, isEditing, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-5">

      {/* ── Identification ──────────────────────────────────────── */}
      <SectionDivider title="Identification" />

      <Field label="Product Code (Primary Key)">
        <span className="font-mono text-blue-700 font-medium">{product.productCode}</span>
      </Field>

      <Field label="ITEM#">
        <span className="font-mono font-medium">{product.itemNo}</span>
      </Field>

      <Field label="Item Description" span2>
        {isEditing
          ? <textarea className={TEXTAREA_CLS} rows={6} value={product.itemDescriptionText} onChange={e => onChange({ itemDescriptionText: e.target.value })} />
          : <p className="text-slate-700 leading-relaxed whitespace-pre-line">{product.itemDescriptionText}</p>
        }
      </Field>

      {/* ── Classification ───────────────────────────────────────── */}
      <SectionDivider title="Classification" />

      <Field label="Product Category">
        {isEditing
          ? <SelectField value={product.productCategory} options={PRODUCT_CATEGORY_OPTIONS} onChange={v => onChange({ productCategory: v })} />
          : val(product.productCategory)
        }
      </Field>

      <Field label="Brand">
        {isEditing
          ? <SelectField value={product.brand} options={BRAND_OPTIONS} onChange={v => onChange({ brand: v })} />
          : val(product.brand)
        }
      </Field>

      <Field label="Status">
        {isEditing
          ? <select className={SELECT_CLS} value={product.status} onChange={e => onChange({ status: e.target.value as ProductDetail['status'] })}>
              <option value="Concept">Concept</option>
              <option value="Proposed">Proposed</option>
              <option value="Pre-selected">Pre-selected</option>
              <option value="Initial Sampled">Initial Sampled</option>
              <option value="Production">Production</option>
              <option value="Dropped">Dropped</option>
            </select>
          : val(product.status)
        }
      </Field>

      <Field label="Parent or Baby">
        {isEditing
          ? <select className={SELECT_CLS} value={product.parentOrBaby ?? ''} onChange={e => onChange({ parentOrBaby: (e.target.value || null) as ProductDetail['parentOrBaby'] })}>
              <option value="">—</option>
              <option value="Parent">Parent</option>
              <option value="Baby">Baby</option>
            </select>
          : val(product.parentOrBaby)
        }
      </Field>

      <Field label="Parent #">
        {isEditing
          ? <input type="text" className={INPUT_CLS} value={product.parentNumber ?? ''} onChange={e => onChange({ parentNumber: e.target.value || null })} />
          : val(product.parentNumber, true)
        }
      </Field>

      {/* ── Team & Ownership ─────────────────────────────────────── */}
      <SectionDivider title="Team & Ownership" />

      <Field label="Creating Team">
        {isEditing
          ? <select className={SELECT_CLS} value={product.creatingTeam} onChange={e => onChange({ creatingTeam: e.target.value as 'China' | 'US' })}>
              <option value="China">China</option>
              <option value="US">US</option>
            </select>
          : <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full
              ${product.creatingTeam === 'China' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
              {product.creatingTeam === 'China' ? '🇨🇳' : '🇺🇸'} {product.creatingTeam}
            </span>
        }
      </Field>

      <Field label="Designer">
        <div className="flex flex-wrap gap-3">
          {product.designers.length === 0
            ? <span className="text-slate-300">—</span>
            : product.designers.map(d => (
                <div key={d.id} className="flex items-center gap-1.5">
                  <img src={d.avatar} alt={d.name} className="w-6 h-6 rounded-full flex-shrink-0" />
                  <span>{d.name}</span>
                </div>
              ))}
        </div>
      </Field>

      <Field label="US PD">
        <PersonField member={product.usPd} isEditing={isEditing} onChange={m => onChange({ usPd: m })} />
      </Field>

      <Field label="NB Sourcing">
        <PersonField member={product.nbSourcing} isEditing={isEditing} onChange={m => onChange({ nbSourcing: m })} />
      </Field>

      <Field label="NB PD">
        <PersonField member={product.nbPd} isEditing={isEditing} onChange={m => onChange({ nbPd: m })} />
      </Field>

      {/* ── Planning & Status ────────────────────────────────────── */}
      <SectionDivider title="Planning & Status" />

      <Field label="Product Filing">
        {isEditing
          ? <SelectField value={product.productFiling} options={PRODUCT_FILING_OPTIONS} onChange={v => onChange({ productFiling: v || null })} />
          : val(product.productFiling)
        }
      </Field>

      <Field label="Initial Selection">
        {isEditing
          ? <SelectField value={product.initialSelection} options={INITIAL_SELECTION_OPTIONS} onChange={v => onChange({ initialSelection: v })} />
          : val(product.initialSelection)
        }
      </Field>

      <Field label="Committed?">
        {isEditing
          ? <label className="inline-flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={!!product.committed} onChange={e => onChange({ committed: e.target.checked })} className="w-4 h-4 rounded accent-blue-600" />
              <span className="text-sm text-slate-600">{product.committed ? 'Yes' : 'No'}</span>
            </label>
          : yesNo(product.committed)
        }
      </Field>

      <Field label="Purchasing Type">
        {isEditing
          ? <SelectField value={product.purchasingType} options={PURCHASING_TYPE_OPTIONS} onChange={v => onChange({ purchasingType: v || null })} />
          : val(product.purchasingType)
        }
      </Field>

      <Field label="Created At">
        <span className="text-slate-500">{product.createdAt}</span>
      </Field>

      <Field label="Updated At">
        <span className="text-slate-500">{product.updatedAt}</span>
      </Field>

      {/* ── Sourcing ─────────────────────────────────────────────── */}
      <SectionDivider title="Sourcing" />

      <Field label="Factory Name">
        {isEditing
          ? <input type="text" className={INPUT_CLS} value={product.factoryName ?? ''} onChange={e => onChange({ factoryName: e.target.value || null })} />
          : val(product.factoryName)
        }
      </Field>

      <Field label="MOQ">
        {isEditing
          ? <input type="number" className={INPUT_CLS} value={product.moq ?? ''} onChange={e => onChange({ moq: e.target.value === '' ? null : Number(e.target.value) })} />
          : product.moq !== null && product.moq !== undefined
            ? <span className="font-medium">{product.moq.toLocaleString()}</span>
            : <span className="text-slate-300">—</span>
        }
      </Field>

      {/* ── Comments ─────────────────────────────────────────────── */}
      <SectionDivider title="Comments" />

      <div className="col-span-2 text-sm text-slate-800">
        {isEditing
          ? <textarea className={TEXTAREA_CLS} rows={3} value={product.solComments ?? ''} onChange={e => onChange({ solComments: e.target.value || null })} />
          : product.solComments
            ? <p className="text-slate-700 leading-relaxed whitespace-pre-line">{product.solComments}</p>
            : <span className="text-slate-300">—</span>
        }
      </div>

    </div>
  )
}
