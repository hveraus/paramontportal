import { useState } from 'react'
import type { ProductComment, IterationRecord } from '../types'
import CommentsThread from './CommentsThread'
import Timeline from './Timeline'

interface Props {
  comments: ProductComment[]
  records: IterationRecord[]
}

type Tab = 'comments' | 'history'

export default function ActivityPanel({ comments, records }: Props) {
  const [active, setActive] = useState<Tab>('comments')
  const [commentCount, setCommentCount] = useState(comments.length)

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-slate-100">
        <button
          onClick={() => setActive('comments')}
          className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors
            ${active === 'comments'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
        >
          Comments
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-normal
            ${active === 'comments' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
            {commentCount}
          </span>
        </button>

        <button
          onClick={() => setActive('history')}
          className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors
            ${active === 'history'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
        >
          Change History
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-normal
            ${active === 'history' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
            {records.length}
          </span>
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
      </div>
    </div>
  )
}
