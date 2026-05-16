import { useRef, useState } from 'react'
import type { SpotComment } from '../../../types/spot'
import { CommentCard } from './CommentCard'

interface SpotCommentsSectionProps {
  comments: SpotComment[]
  newComment: string
  isLoading?: boolean
  isSubmitting?: boolean
  error?: string | null
  submitError?: string | null
  onNewCommentChange: (value: string) => void
  onSubmit: () => Promise<boolean>
}

export function SpotCommentsSection({
  comments,
  newComment,
  isLoading = false,
  isSubmitting = false,
  error = null,
  submitError = null,
  onNewCommentChange,
  onSubmit,
}: SpotCommentsSectionProps) {
  const [isWriting, setIsWriting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async () => {
    if (!newComment.trim() || isSubmitting) return
    const ok = await onSubmit()
    if (ok) {
      setIsWriting(false)
      inputRef.current?.blur()
    }
  }

  const openComposer = () => {
    setIsWriting(true)
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  return (
    <section className="space-y-5 pb-2">
      {!isWriting ? (
        <button
          type="button"
          onClick={openComposer}
          className="min-h-[52px] w-full rounded-xl bg-spot-input px-5 py-5 text-left text-base text-spot-dim transition-colors hover:bg-spot-input/80"
        >
          댓글 작성하기
        </button>
      ) : (
        <div className="min-h-[52px] rounded-xl bg-spot-input px-5 py-5">
          <input
            ref={inputRef}
            type="text"
            value={newComment}
            onChange={(e) => onNewCommentChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void handleSubmit()
              if (e.key === 'Escape') {
                setIsWriting(false)
                onNewCommentChange('')
              }
            }}
            onBlur={() => {
              if (!newComment.trim()) setIsWriting(false)
            }}
            disabled={isSubmitting}
            placeholder="댓글을 입력하세요"
            className="w-full bg-transparent text-base leading-normal text-white placeholder:text-spot-dim focus:outline-none"
          />
        </div>
      )}

      {submitError && (
        <p className="text-sm text-red-400" role="alert">
          {submitError}
        </p>
      )}

      {isLoading && (
        <p className="text-sm text-spot-dim">방문 후기를 불러오는 중…</p>
      )}

      {error && !isLoading && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      {!isLoading && !error && comments.length === 0 && (
        <p className="text-sm text-spot-dim">아직 방문 후기가 없습니다.</p>
      )}

      <div className="flex flex-col gap-8">
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>
    </section>
  )
}
