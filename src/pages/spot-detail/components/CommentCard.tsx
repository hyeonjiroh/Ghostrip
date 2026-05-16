import type { SpotComment } from '../../../types/spot'

const AVATARS: Record<string, string> = {
  고스트헌터: '👻',
  공포덕후99: '💀',
  밤탐험가: '🔦',
}

interface CommentCardProps {
  comment: SpotComment
}

export function CommentCard({ comment }: CommentCardProps) {
  const avatar = AVATARS[comment.author] ?? '🌙'

  return (
    <article className="flex items-start gap-3">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-7 text-base"
        aria-hidden
      >
        {avatar}
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-sm font-medium text-white">{comment.author}</p>
        <p className="text-sm leading-relaxed text-gray-2">{comment.content}</p>
        <p className="text-[11px] text-spot-dim">{comment.createdAt}</p>
      </div>
    </article>
  )
}
