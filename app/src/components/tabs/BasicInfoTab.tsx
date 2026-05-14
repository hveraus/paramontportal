import type { ProductDetail } from '../../types'

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
    <div className="col-span-2 flex items-center gap-3 pt-4 pb-1">
      <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">{title}</span>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  )
}

// ── main ─────────────────────────────────────────────────────────────────

export default function BasicInfoTab({ product }: { product: ProductDetail }) {
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

      {/* ── Status ──────────────────────────────────────────────── */}
      <SectionDivider title="Hierarchy & Planning" />

      <Field label="Parent or Baby">
        {val(product.parentOrBaby)}
      </Field>

      <Field label="Parent #">
        {val(product.parentNumber, true)}
      </Field>

      <Field label="Committed?">
        {yesNo(product.committed)}
      </Field>

      <Field label="Item Data Finalized?">
        {yesNo(product.itemDataFinalized)}
      </Field>

      {/* ── Product Details ──────────────────────────────────────── */}
      <SectionDivider title="Product Details" />

      <Field label="Product Name" span2>
        <span className="font-medium text-slate-900">{product.productName}</span>
      </Field>

      <Field label="Category (品类)">
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

      <Field label="Product Category">
        {val(product.productCategory)}
      </Field>

      <Field label="Brand">
        {val(product.brand)}
      </Field>

      <Field label="Age Grade">
        {val(product.ageGrade)}
      </Field>

      {/* ── Operations ───────────────────────────────────────────── */}
      <SectionDivider title="Operations" />

      <Field label="Creating Team">
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full
          ${product.creatingTeam === 'China' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
          {product.creatingTeam === 'China' ? '🇨🇳' : '🇺🇸'} {product.creatingTeam}
        </span>
      </Field>

      <Field label="Owner">
        <div className="flex items-center gap-2">
          <img src={product.owner.avatar} alt={product.owner.name} className="w-6 h-6 rounded-full" />
          <span>{product.owner.name}</span>
        </div>
      </Field>

      <Field label="Initial Selection">
        {val(product.initialSelection)}
      </Field>

      <Field label="Border - Domestic">
        {val(product.borderDomestic)}
      </Field>

      <Field label="FOB Point">
        {val(product.fobPoint)}
      </Field>

      <Field label="Factory Name">
        {val(product.factoryName)}
      </Field>

      <Field label="Est. Order QTY">
        {product.estOrderQty !== null
          ? <span className="font-medium">{product.estOrderQty.toLocaleString()}</span>
          : <span className="text-slate-300">—</span>}
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
        <div
          className="text-sm text-slate-700 leading-relaxed prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: product.itemDescription }}
        />
      </Field>

      {product.productSpec && (
        <Field label="Product Spec" span2>
          <p className="text-slate-700 leading-relaxed">{product.productSpec}</p>
        </Field>
      )}

      {product.itemPackagingSpec && (
        <Field label="Item Packaging Spec" span2>
          <p className="text-slate-700 leading-relaxed">{product.itemPackagingSpec}</p>
        </Field>
      )}

      {product.materialBreakdown && (
        <Field label="Material Breakdown" span2>
          <p className="text-slate-700 leading-relaxed">{product.materialBreakdown}</p>
        </Field>
      )}

      {product.assortmentBreakdown && (
        <Field label="Assortment Breakdown" span2>
          <p className="text-slate-700 leading-relaxed">{product.assortmentBreakdown}</p>
        </Field>
      )}

      {product.solComments && (
        <Field label="Comments (SOL)" span2>
          <p className="text-slate-700 leading-relaxed">{product.solComments}</p>
        </Field>
      )}

    </div>
  )
}
