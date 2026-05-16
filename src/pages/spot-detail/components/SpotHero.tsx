import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Heart, Images } from 'lucide-react'
import type { GhostSpot } from '../../../types/spot'

interface SpotHeroProps {
  spot: GhostSpot
}

export function SpotHero({ spot }: SpotHeroProps) {
  const navigate = useNavigate()
  // TODO(API): GET /spots/:spotId/bookmark — 초기값, POST/DELETE로 토글
  const [bookmarked, setBookmarked] = useState(false)

  return (
    <div className="relative h-[220px] w-full overflow-hidden">
      <img src={spot.imageUrl} alt={spot.name} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

      <div className="absolute top-0 right-0 left-0 flex items-center justify-between p-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-1 shadow-sm transition-colors hover:bg-white"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={() => setBookmarked(!bookmarked)}
          aria-label={bookmarked ? '북마크 해제' : '북마크'}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors hover:bg-white"
        >
          <Heart
            size={18}
            className={bookmarked ? 'fill-secondary text-secondary' : 'text-gray-1'}
          />
        </button>
      </div>

      {spot.galleryImages.length > 0 && (
        <div className="absolute right-4 bottom-4">
          <span className="flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[11px] text-white backdrop-blur-sm">
            <Images size={11} />
            +{spot.galleryImages.length}
          </span>
        </div>
      )}
    </div>
  )
}
