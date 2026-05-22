import type { ProductDetail } from '../../types'

const INPUT_CLS = "w-full h-9 px-3 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-colors"
const TEXTAREA_CLS = "w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 resize-none transition-colors"
const SELECT_CLS = "w-full h-9 px-3 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-colors appearance-none"

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

      <Field label="Product Code">
        <span className="font-mono text-blue-700 font-medium">{product.productCode}</span>
      </Field>

      <Field label="ITEM# (Primary Key)">
        <span className="font-mono font-medium">{product.itemNo}</span>
      </Field>

      <Field label="UPC#">
        {val(product.upc, true)}
      </Field>

      <Field label="12 Digit UPC">
        {val(product.upc12Digit, true)}
      </Field>

      {/* ── Product Details ──────────────────────────────────────── */}
      <SectionDivider title="Product Details" />

      <Field label="Product Name" span2>
        {isEditing
          ? <input type="text" className={INPUT_CLS} value={product.productName} onChange={e => onChange({ productName: e.target.value })} />
          : <span className="font-medium text-slate-900">{product.productName}</span>
        }
      </Field>

      <Field label="Brand">
        {isEditing
          ? <input type="text" className={INPUT_CLS} value={product.brand} onChange={e => onChange({ brand: e.target.value })} />
          : val(product.brand)
        }
      </Field>

      <Field label="Product Category">
        {isEditing
          ? <input type="text" className={INPUT_CLS} value={product.productCategory} onChange={e => onChange({ productCategory: e.target.value })} />
          : val(product.productCategory)
        }
      </Field>

      <Field label="Category">
        <div className="flex items-center gap-1.5 flex-wrap">
          {product.categoryPath.map((c, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-slate-300 text-xs">›</span>}
              <span className={i === product.categoryPath.length - 1
                ? 'text-blue-700 font-medium' : 'text-slate-600'}>{c}</span>
            </span>
          ))}
        </div>
      </Field>

      <Field label="Age Grade">
        {isEditing
          ? <select className={SELECT_CLS} value={product.ageGrade ?? ''} onChange={e => onChange({ ageGrade: (e.target.value || null) as ProductDetail['ageGrade'] })}>
              <option value="">—</option>
              <option value="3+">3+</option>
              <option value="6+">6+</option>
              <option value="8+">8+</option>
              <option value="14+">14+</option>
            </select>
          : val(product.ageGrade)
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

      {/* ── Hierarchy & Planning ──────────────────────────────────── */}
      <SectionDivider title="Hierarchy & Planning" />

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

      <Field label="Committed?">
        {isEditing
          ? <label className="inline-flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={!!product.committed} onChange={e => onChange({ committed: e.target.checked })} className="w-4 h-4 rounded accent-blue-600" />
              <span className="text-sm text-slate-600">{product.committed ? 'Yes' : 'No'}</span>
            </label>
          : yesNo(product.committed)
        }
      </Field>

      <Field label="Item Data Finalized?">
        {isEditing
          ? <label className="inline-flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={!!product.itemDataFinalized} onChange={e => onChange({ itemDataFinalized: e.target.checked })} className="w-4 h-4 rounded accent-blue-600" />
              <span className="text-sm text-slate-600">{product.itemDataFinalized ? 'Yes' : 'No'}</span>
            </label>
          : yesNo(product.itemDataFinalized)
        }
      </Field>

      {/* ── Operations ───────────────────────────────────────────── */}
      <SectionDivider title="Operations" />

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
          {product.designers.map(d => (
            <div key={d.id} className="flex items-center gap-1.5">
              <img src={d.avatar} alt={d.name} className="w-6 h-6 rounded-full flex-shrink-0" />
              <span>{d.name}</span>
            </div>
          ))}
        </div>
      </Field>

      <Field label="Design Due Date">
        {isEditing
          ? <input type="date" className={INPUT_CLS} value={product.designDueDate ?? ''} onChange={e => onChange({ designDueDate: e.target.value || null })} />
          : val(product.designDueDate)
        }
      </Field>

      <Field label="NB Sourcing">
        {product.nbSourcing
          ? <div className="flex items-center gap-1.5">
              <img src={product.nbSourcing.avatar} alt={product.nbSourcing.name} className="w-6 h-6 rounded-full flex-shrink-0" />
              <span>{product.nbSourcing.name}</span>
            </div>
          : <span className="text-slate-300">—</span>
        }
      </Field>

      <Field label="NB PD">
        {product.nbPd
          ? <div className="flex items-center gap-1.5">
              <img src={product.nbPd.avatar} alt={product.nbPd.name} className="w-6 h-6 rounded-full flex-shrink-0" />
              <span>{product.nbPd.name}</span>
            </div>
          : <span className="text-slate-300">—</span>
        }
      </Field>

      <Field label="Initial Selection">
        {isEditing
          ? <input type="text" className={INPUT_CLS} value={product.initialSelection} onChange={e => onChange({ initialSelection: e.target.value })} />
          : val(product.initialSelection)
        }
      </Field>

      <Field label="Border - Domestic">
        {isEditing
          ? <select className={SELECT_CLS} value={product.borderDomestic ?? ''} onChange={e => onChange({ borderDomestic: (e.target.value || null) as ProductDetail['borderDomestic'] })}>
              <option value="">—</option>
              <option value="Domestic">Domestic</option>
              <option value="Direct Import">Direct Import</option>
            </select>
          : val(product.borderDomestic)
        }
      </Field>

      <Field label="FOB Point">
        {isEditing
          ? <select className={SELECT_CLS} value={product.fobPoint ?? ''} onChange={e => onChange({ fobPoint: (e.target.value || null) as ProductDetail['fobPoint'] })}>
              <option value="">—</option>
              <option value="Ningbo">Ningbo</option>
              <option value="Shenzhen">Shenzhen</option>
              <option value="Huzhiming">Huzhiming</option>
              <option value="Haiphong">Haiphong</option>
              <option value="Shanghai">Shanghai</option>
            </select>
          : val(product.fobPoint)
        }
      </Field>

      <Field label="Factory Name">
        {isEditing
          ? <input type="text" className={INPUT_CLS} value={product.factoryName ?? ''} onChange={e => onChange({ factoryName: e.target.value || null })} />
          : val(product.factoryName)
        }
      </Field>

      <Field label="Est. Order QTY">
        {isEditing
          ? <input type="number" className={INPUT_CLS} value={product.estOrderQty ?? ''} onChange={e => onChange({ estOrderQty: e.target.value === '' ? null : Number(e.target.value) })} />
          : product.estOrderQty !== null
            ? <span className="font-medium">{product.estOrderQty.toLocaleString()}</span>
            : <span className="text-slate-300">—</span>
        }
      </Field>

      <Field label="Created At">
        <span className="text-slate-500">{product.createdAt}</span>
      </Field>

      <Field label="Updated At">
        <span className="text-slate-500">{product.updatedAt}</span>
      </Field>

      {/* ── Descriptions ─────────────────────────────────────────── */}
      <SectionDivider title="Descriptions" />

      <Field label="Description (Features & Benefits)" span2>
        {isEditing
          ? <textarea className={TEXTAREA_CLS} rows={5} value={product.itemDescription} onChange={e => onChange({ itemDescription: e.target.value })} />
          : <div
              className="text-sm text-slate-700 leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: product.itemDescription }}
            />
        }
      </Field>

      <Field label="Material Breakdown" span2>
        {isEditing
          ? <textarea className={TEXTAREA_CLS} rows={4} value={product.materialBreakdown ?? ''} onChange={e => onChange({ materialBreakdown: e.target.value || null })} />
          : product.materialBreakdown
            ? <p className="text-slate-700 leading-relaxed">{product.materialBreakdown}</p>
            : <span className="text-slate-300">—</span>
        }
      </Field>

      <Field label="Assortment Breakdown" span2>
        {isEditing
          ? <textarea className={TEXTAREA_CLS} rows={4} value={product.assortmentBreakdown ?? ''} onChange={e => onChange({ assortmentBreakdown: e.target.value || null })} />
          : product.assortmentBreakdown
            ? <p className="text-slate-700 leading-relaxed">{product.assortmentBreakdown}</p>
            : <span className="text-slate-300">—</span>
        }
      </Field>


    </div>
  )
}
