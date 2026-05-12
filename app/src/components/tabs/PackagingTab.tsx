import type { ProductDetail } from '../../types'

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

export default function PackagingTab({ product }: { product: ProductDetail }) {
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
          {packagingType
            ? <span>{packagingType}</span>
            : <span className="text-slate-300">—</span>}
        </Field>

        <Field label="Count Per Package">
          {num(countPerPackage)} {countPerPackage !== null && <span className="text-slate-400 text-xs ml-1">pc</span>}
        </Field>

        <Field label="Master Qty">
          {num(masterQty)} {masterQty !== null && <span className="text-slate-400 text-xs ml-1">pcs / carton</span>}
        </Field>

        <Field label="Inner Qty">
          {num(innerQty)} {innerQty !== null && <span className="text-slate-400 text-xs ml-1">pcs / inner box</span>}
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

      {/* Packing structure diagram */}
      <div className="h-px bg-slate-100" />
      <div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">Packing Structure</p>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-3">
            <span className="text-2xl">📦</span>
            <div>
              <p className="text-xs text-slate-400">Retail Unit</p>
              <p className="text-sm font-semibold text-slate-800">{countPerPackage} pc</p>
            </div>
          </div>
          <span className="text-slate-300 text-xl font-light">×</span>
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-3">
            <span className="text-2xl">🗃️</span>
            <div>
              <p className="text-xs text-slate-400">Inner Box</p>
              <p className="text-sm font-semibold text-slate-800">{innerQty} pcs</p>
            </div>
          </div>
          <span className="text-slate-300 text-xl font-light">×</span>
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-3">
            <span className="text-2xl">🏭</span>
            <div>
              <p className="text-xs text-slate-400">Master Carton</p>
              <p className="text-sm font-semibold text-slate-800">{masterQty} pcs total</p>
            </div>
          </div>
          {totalMasterCartons !== null && <>
            <span className="text-slate-300 text-xl font-light">×</span>
            <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-4 py-3">
              <span className="text-2xl">🚢</span>
              <div>
                <p className="text-xs text-slate-400">Total Cartons</p>
                <p className="text-sm font-semibold text-blue-700">{totalMasterCartons.toLocaleString()} ctns</p>
              </div>
            </div>
          </>}
        </div>
      </div>
    </div>
  )
}
