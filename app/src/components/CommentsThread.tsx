import { useState, useRef, useEffect } from 'react'
import type { ProductComment, CommentTeam } from '../types'
import { useRole } from '../context/RoleContext'

const TEAM_STYLE: Record<CommentTeam, string> = {
  US: 'bg-amber-100 text-amber-700',
  NB: 'bg-blue-100 text-blue-700',
}

function formatDate(iso: string) {
  const d = new Date(iso.replace(' ', 'T'))
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

interface CommentItemProps {
  comment: ProductComment
  isOwn: boolean
  onEdit: (id: string, newContent: string) => void
  onDelete: (id: string) => void
}

function CommentItem({ comment, isOwn, onEdit, onDelete }: CommentItemProps) {
  const [editing, setEditing]   = useState(false)
  const [draft, setDraft]       = useState(comment.content)
  const textareaRef             = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (editing) textareaRef.current?.focus()
  }, [editing])

  const handleSave = () => {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== comment.content) onEdit(comment.id, trimmed)
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setDraft(comment.content); setEditing(false) }
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSave()
  }

  return (
    <div className="flex gap-3 group">
      {/* Avatar */}
      <img
        src={comment.authorAvatar}
        alt={comment.authorName}
        className="w-8 h-8 rounded-full flex-shrink-0 mt-0.5"
      />

      {/* Body */}
      <div className="flex-1 min-w-0">
        {/* Header row */}
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-sm font-medium text-slate-800">{comment.authorName}</span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TEAM_STYLE[comment.team]}`}>
            {comment.team}
          </span>
          <span className="text-xs text-slate-400">{formatDate(comment.date)}</span>

          {/* Edit / Delete — own comments only, visible on hover */}
          {isOwn && !editing && (
            <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => { setDraft(comment.content); setEditing(true) }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                title="Edit"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2
                       0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(comment.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Delete"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5
                       4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Content or editor */}
        {editing ? (
          <div className="space-y-2">
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={3}
              className="w-full text-sm text-slate-800 border border-blue-300 rounded-lg px-3 py-2
                         resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={!draft.trim()}
                className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg
                           hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => { setDraft(comment.content); setEditing(false) }}
                className="text-xs px-3 py-1.5 text-slate-500 hover:text-slate-700 rounded-lg
                           hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <span className="text-xs text-slate-400 ml-auto hidden sm:block">⌘↵ to save · Esc to cancel</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-700 leading-relaxed">{comment.content}</p>
        )}
      </div>
    </div>
  )
}

interface Props {
  initialComments: ProductComment[]
  onCountChange?: (count: number) => void
}

export default function CommentsThread({ initialComments, onCountChange }: Props) {
  const { currentUser } = useRole()
  const [comments, setComments] = useState<ProductComment[]>(initialComments)
  const [newText, setNewText]   = useState('')
  const [submitting, setSubmitting] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const updateComments = (next: ProductComment[]) => {
    setComments(next)
    onCountChange?.(next.length)
  }

  const handleAdd = () => {
    const trimmed = newText.trim()
    if (!trimmed) return
    setSubmitting(true)

    const comment: ProductComment = {
      id: `c-${Date.now()}`,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      team: currentUser.team,
      content: trimmed,
    }

    setTimeout(() => {
      updateComments([...comments, comment])
      setNewText('')
      setSubmitting(false)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }, 150)
  }

  const handleEdit = (id: string, newContent: string) => {
    updateComments(comments.map((c) => (c.id === id ? { ...c, content: newContent } : c)))
  }

  const handleDelete = (id: string) => {
    updateComments(comments.filter((c) => c.id !== id))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAdd()
  }

  return (
    <div className="space-y-5">
      {/* Comment list */}
      <div className="space-y-5">
        {comments.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">No comments yet.</p>
        )}
        {comments.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            isOwn={c.authorId === currentUser.id}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100" />

      {/* Add comment */}
      <div className="flex gap-3">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-8 h-8 rounded-full flex-shrink-0 mt-0.5"
        />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-slate-600">{currentUser.name}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TEAM_STYLE[currentUser.team]}`}>
              {currentUser.team}
            </span>
          </div>
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a comment…"
            rows={3}
            className="w-full text-sm text-slate-800 placeholder-slate-400 border border-slate-200 rounded-xl
                       px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400
                       focus:border-blue-400 transition-colors"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">⌘↵ to submit</span>
            <button
              onClick={handleAdd}
              disabled={!newText.trim() || submitting}
              className="text-sm px-4 py-1.5 bg-blue-600 text-white rounded-lg font-medium
                         hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Posting…' : 'Comment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
