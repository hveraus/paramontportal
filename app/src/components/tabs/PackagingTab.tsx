import type { ProductDetail } from '../../types'

const INPUT_CLS = "w-full h-9 px-3 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-colors"
const SELECT_CLS = "w-full h-9 px-3 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-colors appearance-none"

const IN_TO_M = 0.0254
const CBM_TO_CUFT = 35.3147

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">{label}</p>
      <div className="text-sm text-slate-800">{children}</div>
    </div>
  )
}

function num(v: number | null | undefined, decimals = 0) {
  if (v === null || v === undefined) return <span className="text-slate-300">—</span>
  return <span className="font-medium">{v.toFixed(decimals)}</span>
}

interface Props {
  product: ProductDetail
  isEditing: boolean
  onChange: (fields: Partial<ProductDetail>) => void
}

export default function PackagingTab({ product, isEditing, onChange }: Props) {
  const { masterQty, innerQty, countPerPackage, packagingType,
          masterHeight, masterWidth, masterDepth, estOrderQty } = product

  const innerPerMaster = masterQty > 0 && innerQty > 0
    ? Math.round(masterQty / innerQty) : null

  const totalMasterCartons = masterQty && estOrderQty
    ? Math.ceil(estOrderQty / masterQty) : null

  const cbmPerCarton = masterHeight !== null && masterWidth !== null && masterDepth !== null
    ? (masterHeight * IN_TO_M) * (masterWidth * IN_TO_M) * (masterDepth * IN_TO_M)
    : null

  const totalCbm = cbmPerCarton !== null && totalMasterCartons !== null
    ? cbmPerCarton * totalMasterCartons : null

  const totalCuFt = totalCbm !== null ? totalCbm * CBM_TO_CUFT : null

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-x-8 gap-y-5">

        <Field label="Packaging Type">
          {isEditing
            ? <select className={SELECT_CLS} value={packagingType} onChange={e => onChange({ packagingType: e.target.value })}>
                <option value="">—</option>
                <option value="Hang Tag">Hang Tag</option>
                <option value="Box">Box</option>
                <option value="Polybag">Polybag</option>
                <option value="Blister">Blister</option>
                <option value="Other">Other</option>
              </select>
            : packagingType
              ? <span>{packagingType}</span>
              : <span className="text-slate-300">—</span>
          }
        </Field>

<Field label="Count Per Package">
          {isEditing
            ? <input type="number" step="1" className={INPUT_CLS} value={countPerPackage} onChange={e => onChange({ countPerPackage: e.target.value === '' ? 0 : Math.round(Number(e.target.value)) })} />
            : <>{num(countPerPackage)} {countPerPackage !== null && <span className="text-slate-400 text-xs ml-1">pc</span>}</>
          }
        </Field>

        <Field label="Master Qty">
          {isEditing
            ? <input type="number" step="1" className={INPUT_CLS} value={masterQty} onChange={e => onChange({ masterQty: e.target.value === '' ? 0 : Math.round(Number(e.target.value)) })} />
            : <>{num(masterQty)} {masterQty !== null && <span className="text-slate-400 text-xs ml-1">pcs / carton</span>}</>
          }
        </Field>

        <Field label="Inner Qty">
          {isEditing
            ? <input type="number" step="1" className={INPUT_CLS} value={innerQty} onChange={e => onChange({ innerQty: e.target.value === '' ? 0 : Math.round(Number(e.target.value)) })} />
            : <>{num(innerQty)} {innerQty !== null && <span className="text-slate-400 text-xs ml-1">pcs / inner box</span>}</>
          }
        </Field>

        <Field label="Inner per Master">
          {innerPerMaster !== null
            ? <span className="font-medium">{innerPerMaster} <span className="text-slate-400 text-xs ml-1">boxes</span></span>
            : <span className="text-slate-300">—</span>}
        </Field>

        <Field label="Total Master Cartons">
          {totalMasterCartons !== null
            ? <span className="font-medium">{totalMasterCartons.toLocaleString()} <span className="text-slate-400 text-xs ml-1">ctns</span></span>
            : <span className="text-slate-300">—</span>}
        </Field>

        <Field label="Total CBM">
          {totalCbm !== null
            ? <span className="font-medium">{totalCbm.toFixed(3)} <span className="text-slate-400 text-xs ml-1">m³</span></span>
            : <span className="text-slate-300">—</span>}
        </Field>

        <Field label="Total Cu.Ft">
          {totalCuFt !== null
            ? <span className="font-medium">{totalCuFt.toFixed(2)} <span className="text-slate-400 text-xs ml-1">cu ft</span></span>
            : <span className="text-slate-300">—</span>}
        </Field>

      </div>

      {/* Packaging Spec */}
      <div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Packaging Spec</p>
        {isEditing
          ? <textarea
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 resize-none transition-colors"
              rows={5}
              value={product.itemPackagingSpec ?? ''}
              onChange={e => onChange({ itemPackagingSpec: e.target.value || null })}
            />
          : product.itemPackagingSpec
            ? <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{product.itemPackagingSpec}</p>
            : <span className="text-sm text-slate-300">—</span>
        }
      </div>

    </div>
  )
}
