import { useState } from 'react'
import type { ProductComment, IterationRecord } from '../types'
import CommentsThread from './CommentsThread'
import Timeline from './Timeline'
import PDNotesPanel from './PDNotesPanel'

interface Props {
  comments: ProductComment[]
  records: IterationRecord[]
  pdComments: string | null
  nbPdComments: string | null
}

type Tab = 'comments' | 'history' | 'pdnotes'

export default function ActivityPanel({ comments, records, pdComments, nbPdComments }: Props) {
  const [active, setActive] = useState<Tab>('comments')
  const [commentCount, setCommentCount] = useState(comments.length)

  const tabCls = (t: Tab) =>
    `flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors
    ${active === t
      ? 'border-blue-600 text-blue-700 bg-blue-50/50'
      : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
    }`

  const badgeCls = (t: Tab) =>
    `text-xs px-1.5 py-0.5 rounded-full font-normal
    ${active === t ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-slate-100">
        <button onClick={() => setActive('comments')} className={tabCls('comments')}>
          Comments
          <span className={badgeCls('comments')}>{commentCount}</span>
        </button>

        <button onClick={() => setActive('history')} className={tabCls('history')}>
          Change History
          <span className={badgeCls('history')}>{records.length}</span>
        </button>

        <button onClick={() => setActive('pdnotes')} className={tabCls('pdnotes')}>
          PD Notes
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {active === 'comments' && (
          <CommentsThread
            initialComments={comments}
            onCountChange={setCommentCount}
          />
        )}
        {active === 'history' && (
          <Timeline records={records} />
        )}
        {active === 'pdnotes' && (
          <PDNotesPanel pdComments={pdComments} nbPdComments={nbPdComments} />
        )}
      </div>
    </div>
  )
}
