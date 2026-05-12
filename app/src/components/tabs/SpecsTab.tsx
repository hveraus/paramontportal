import type { ProductDetail } from '../../types'

const IN_TO_CM = 2.54
const G_TO_LBS = 1 / 453.592
const KG_TO_LBS = 2.20462

function num(v: number | null | undefined, decimals = 2): string | null {
  if (v === null || v === undefined) return null
  return v.toFixed(decimals)
}

function Cell({ label, primary, secondary }: {
  label: string
  primary: string | null
  secondary?: string | null
}) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">{label}</p>
      {primary !== null
        ? <>
            <p className="text-sm font-medium text-slate-900">{primary}</p>
            {secondary && <p className="text-xs text-slate-400 mt-0.5">{secondary}</p>}
          </>
        : <span className="text-sm text-slate-300">—</span>
      }
    </div>
  )
}

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">{title}</span>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  )
}

export default function SpecsTab({ product }: { product: ProductDetail }) {
  const { itemHeight, itemWidth, itemDepth, itemWeightG,
          innerHeight, innerWidth, innerDepth, innerWeightLbs,
          masterHeight, masterWidth, masterDepth,
          grossWeightKg, netWeightKg } = product

  const masterHCm = masterHeight !== null ? masterHeight * IN_TO_CM : null
  const masterWCm = masterWidth  !== null ? masterWidth  * IN_TO_CM : null
  const masterDCm = masterDepth  !== null ? masterDepth  * IN_TO_CM : null

  const cbm = masterHCm !== null && masterWCm !== null && masterDCm !== null
    ? (masterHCm / 100) * (masterWCm / 100) * (masterDCm / 100)
    : null
  const cuFt = cbm !== null ? cbm * 35.3147 : null

  const gwLbs = grossWeightKg !== null ? grossWeightKg * KG_TO_LBS : null
  const nwLbs = netWeightKg   !== null ? netWeightKg   * KG_TO_LBS : null
  const itemWeightLbs = itemWeightG !== null ? itemWeightG * G_TO_LBS : null

  return (
    <div className="space-y-5">

      <SectionDivider title="Item" />
      <div className="grid grid-cols-3 gap-x-6 gap-y-5">
        <Cell label="Item Height (inch)" primary={num(itemHeight)} />
        <Cell label="Item Width (inch)"  primary={num(itemWidth)} />
        <Cell label="Item Depth (inch)"  primary={num(itemDepth)} />
        <Cell
          label="Item Weight (g)"
          primary={num(itemWeightG, 0)}
          secondary={itemWeightLbs !== null ? `${itemWeightLbs.toFixed(3)} lbs` : undefined}
        />
      </div>

      <SectionDivider title="Inner Box" />
      <div className="grid grid-cols-3 gap-x-6 gap-y-5">
        <Cell label="Inner Height (inch)" primary={num(innerHeight)} />
        <Cell label="Inner Width (inch)"  primary={num(innerWidth)} />
        <Cell label="Inner Depth (inch)"  primary={num(innerDepth)} />
        <Cell label="Inner Weight (lbs)"  primary={num(innerWeightLbs, 3)} />
      </div>

      <SectionDivider title="Master Carton" />
      <div className="grid grid-cols-3 gap-x-6 gap-y-5">
        <Cell
          label="Master Height (inch)"
          primary={num(masterHeight)}
          secondary={masterHCm !== null ? `${masterHCm.toFixed(1)} cm` : undefined}
        />
        <Cell
          label="Master Width (inch)"
          primary={num(masterWidth)}
          secondary={masterWCm !== null ? `${masterWCm.toFixed(1)} cm` : undefined}
        />
        <Cell
          label="Master Depth (inch)"
          primary={num(masterDepth)}
          secondary={masterDCm !== null ? `${masterDCm.toFixed(1)} cm` : undefined}
        />
      </div>

      <SectionDivider title="Weight & Volume" />
      <div className="grid grid-cols-3 gap-x-6 gap-y-5">
        <Cell
          label="G.W. (kg)"
          primary={num(grossWeightKg, 2)}
          secondary={gwLbs !== null ? `${gwLbs.toFixed(2)} lbs` : undefined}
        />
        <Cell
          label="N.W. (kg)"
          primary={num(netWeightKg, 2)}
          secondary={nwLbs !== null ? `${nwLbs.toFixed(2)} lbs` : undefined}
        />
        <Cell
          label="CBM"
          primary={cbm !== null ? cbm.toFixed(4) : null}
          secondary={cuFt !== null ? `${cuFt.toFixed(3)} cu ft` : undefined}
        />
      </div>

    </div>
  )
}
