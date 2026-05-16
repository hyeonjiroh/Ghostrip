import { Phone, Share2, Star } from 'lucide-react'
import { SPOT_DISPLAY_META } from '../../../constants/spot'
import type { GhostSpot } from '../../../types/spot'

interface SpotInfoProps {
  spot: GhostSpot
  commentCount: number
}

export function SpotInfo({ spot, commentCount }: SpotInfoProps) {
  return (
    <div className="space-y-3 px-4 pt-4">
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-[26px] leading-tight font-semibold text-gray-1">{spot.name}</h1>
        <div className="flex shrink-0 items-center gap-1 pt-1">
          <Star size={16} className="fill-amber-400 text-amber-400" />
          <span className="text-sm font-semibold text-gray-1">{SPOT_DISPLAY_META.rating}</span>
          <span className="text-sm text-gray-5">({commentCount})</span>
        </div>
      </div>

      <span className="inline-block rounded-full bg-gray-8 px-2.5 py-1 text-xs font-medium text-gray-4">
        {SPOT_DISPLAY_META.category}
      </span>

      <div className="flex gap-2">
        <button
          type="button"
          aria-label="전화"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-7 bg-white text-gray-3 transition-colors hover:bg-gray-8"
        >
          <Phone size={18} />
        </button>
        <button
          type="button"
          aria-label="공유"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-7 bg-white text-gray-3 transition-colors hover:bg-gray-8"
        >
          <Share2 size={18} />
        </button>
      </div>
    </div>
  )
}
