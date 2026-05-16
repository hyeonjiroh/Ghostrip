import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import type { GhostSpot } from '../../../types/spot'

interface SpotDetailCardProps {
  spot: GhostSpot
  onMoreLegend?: () => void
}

export function SpotDetailCard({ spot, onMoreLegend }: SpotDetailCardProps) {
  const [expanded, setExpanded] = useState(false)
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2 px-0.5">
        <span
          className="h-2 w-2 shrink-0 rounded-full bg-secondary shadow-[0_0_8px_rgba(239,68,68,0.85)]"
          aria-hidden
        />
        <h2 className="text-sm font-semibold text-white">{spot.name}이란..</h2>
      </div>

      <div className="spot-text-box">
        <p
          className={`px-0.5 py-0.5 text-sm leading-relaxed text-gray-2 ${
            expanded ? '' : 'line-clamp-4'
          }`}
        >
          {spot.description}
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          if (expanded) {
            onMoreLegend?.()
          } else {
            setExpanded(true)
          }
        }}
        className="flex w-full items-center justify-end gap-0.5 px-0.5 text-sm font-medium text-spot-dim transition-colors hover:text-gray-2"
      >
        {expanded ? '괴담 콘텐츠 보러가기' : '괴담 내용 더 보러가기'}
        <ChevronRight size={16} />
      </button>
    </section>
  )
}
