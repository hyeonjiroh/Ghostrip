import { Skull } from 'lucide-react'
import { HORROR_COLORS, HORROR_LABELS } from '../../../constants/spot'

interface HorrorStarsProps {
  /** 댓글 voteFearLevel 평균 (null이면 평가 없음) */
  level: number | null
}

function toSkullLevel(level: number): number {
  if (level <= 0) return 0
  return Math.min(5, Math.max(1, Math.round(level)))
}

export function HorrorStars({ level }: HorrorStarsProps) {
  if (level === null) {
    return (
      <section className="space-y-3">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-sm font-semibold text-white">체감 공포도</span>
          <span className="text-sm text-spot-dim">아직 평가 없음</span>
        </div>
        <div className="spot-text-box flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-0.5 py-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skull key={i} size={22} style={{ color: '#313030' }} />
            ))}
          </div>
          <span className="px-0.5 py-0.5 text-sm text-spot-dim">—/5</span>
        </div>
      </section>
    )
  }

  const skullLevel = toSkullLevel(level)
  const labelLevel = skullLevel || 1
  const displayScore = level.toFixed(1)

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-0.5">
        <span className="text-sm font-semibold text-white">체감 공포도</span>
        <span className="text-sm font-semibold" style={{ color: HORROR_COLORS[labelLevel] }}>
          {HORROR_LABELS[labelLevel]}
        </span>
      </div>
      <div className="spot-text-box flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 px-0.5 py-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skull
              key={i}
              size={22}
              style={{
                color: i < skullLevel ? HORROR_COLORS[labelLevel] : '#313030',
                filter: i < skullLevel ? `drop-shadow(0 0 6px ${HORROR_COLORS[labelLevel]}80)` : 'none',
              }}
            />
          ))}
        </div>
        <span className="px-0.5 py-0.5 text-sm text-spot-muted">
          {displayScore}
          <span className="text-spot-dim">/5</span>
        </span>
      </div>
    </section>
  )
}
