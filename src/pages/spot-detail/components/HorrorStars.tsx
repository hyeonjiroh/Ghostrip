import { Skull } from 'lucide-react'
import { HORROR_COLORS, HORROR_LABELS } from '../../../constants/spot'

interface HorrorStarsProps {
  level: number
}

export function HorrorStars({ level }: HorrorStarsProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-0.5">
        <span className="text-sm font-semibold text-white">체감 공포도</span>
        <span className="text-sm font-semibold" style={{ color: HORROR_COLORS[level] }}>
          {HORROR_LABELS[level]}
        </span>
      </div>
      <div className="spot-text-box flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 px-0.5 py-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skull
              key={i}
              size={22}
              style={{
                color: i < level ? HORROR_COLORS[level] : '#313030',
                filter: i < level ? `drop-shadow(0 0 6px ${HORROR_COLORS[level]}80)` : 'none',
              }}
            />
          ))}
        </div>
        <span className="px-0.5 py-0.5 text-sm text-spot-muted">
          {level}
          <span className="text-spot-dim">/5</span>
        </span>
      </div>
    </section>
  )
}
