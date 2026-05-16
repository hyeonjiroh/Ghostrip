import { ArrowUp } from 'lucide-react'
import type { SpotComment } from '../../../types/spot'
import { CommentCard } from './CommentCard'

interface SpotCommentsSectionProps {
  comments: SpotComment[]
  newComment: string
  newVoteFearLevel: string
  isLoading?: boolean
  isSubmitting?: boolean
  canSubmit?: boolean
  error?: string | null
  submitError?: string | null
  onNewCommentChange: (value: string) => void
  onNewVoteFearLevelChange: (value: string) => void
  onSubmit: () => Promise<boolean>
}

export function SpotCommentsSection({
  comments,
  newComment,
  newVoteFearLevel,
  isLoading = false,
  isSubmitting = false,
  canSubmit = false,
  error = null,
  submitError = null,
  onNewCommentChange,
  onNewVoteFearLevelChange,
  onSubmit,
}: SpotCommentsSectionProps) {
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!canSubmit) return
    await onSubmit()
  }

  return (
    <section className="space-y-5 pb-2">
      <h2 className="text-base font-bold text-white">댓글 {comments.length}</h2>

      <form onSubmit={(e) => void handleSubmit(e)} className="flex items-stretch gap-2">
        <div className="flex min-h-[52px] min-w-0 flex-1 overflow-hidden rounded-xl bg-spot-input">
          <input
            type="text"
            value={newComment}
            onChange={(e) => onNewCommentChange(e.target.value)}
            disabled={isSubmitting}
            placeholder="댓글 작성하기"
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-base text-white placeholder:text-spot-dim focus:outline-none"
          />
          <div className="w-px shrink-0 self-stretch bg-gray-7/80" aria-hidden />
          <input
            id="voteFearLevel"
            name="voteFearLevel"
            type="number"
            inputMode="decimal"
            min={0}
            max={5}
            step={0.1}
            value={newVoteFearLevel}
            onChange={(e) => onNewVoteFearLevelChange(e.target.value)}
            disabled={isSubmitting}
            placeholder="0.0~5.0"
            aria-label="공포 지수 (0.0~5.0)"
            className="w-[88px] shrink-0 bg-transparent px-3 py-3 text-center text-base text-white placeholder:text-spot-dim focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl bg-white text-black transition-opacity disabled:opacity-40"
          aria-label="댓글 등록"
        >
          <ArrowUp size={22} strokeWidth={2.5} />
        </button>
      </form>

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
