interface Props {
  pdComments: string | null
  nbPdComments: string | null
}

function Section({ title, text }: { title: string; text: string | null }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">{title}</span>
        <div className="flex-1 h-px bg-slate-100" />
      </div>
      {text
        ? <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{text}</p>
        : <p className="text-sm text-slate-400">—</p>
      }
    </div>
  )
}

export default function PDNotesPanel({ pdComments, nbPdComments }: Props) {
  return (
    <div className="space-y-6">
      <Section title="PD Comments" text={pdComments} />
      <div className="border-t border-slate-100" />
      <Section title="NB PD Comments" text={nbPdComments} />
    </div>
  )
}
