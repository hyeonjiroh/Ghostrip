import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { BestSpotItem } from '../../../apis/spot'
import { useBestSpots } from '../hooks/useBestSpots'

function CompactCard({ spot, rank }: { spot: BestSpotItem; rank: number }) {
  const navigate = useNavigate()
  return (
    <div className="drawer-compact-card" onClick={() => navigate(`/spots/${spot.id}`)}>
      <div className="drawer-compact-img-wrap">
        {spot.imageUrl ? (
          <img className="drawer-compact-img" src={spot.imageUrl} alt={spot.name} />
        ) : (
          <div className="drawer-compact-img drawer-compact-img--empty" />
        )}
        <span className="drawer-rank-badge">{rank}</span>
      </div>
      <p className="drawer-compact-name">{spot.name}</p>
    </div>
  )
}

function GridCard({ spot, rank }: { spot: BestSpotItem; rank: number }) {
  const navigate = useNavigate()
  return (
    <div className="drawer-grid-card" onClick={() => navigate(`/spots/${spot.id}`)}>
      <div className="drawer-grid-img-wrap">
        {spot.imageUrl ? (
          <img className="drawer-grid-img" src={spot.imageUrl} alt={spot.name} />
        ) : (
          <div className="drawer-grid-img drawer-grid-img--empty" />
        )}
        <span className="drawer-rank-badge">{rank}</span>
      </div>
      <div className="drawer-grid-footer">
        <p className="drawer-grid-name">{spot.name}</p>
      </div>
    </div>
  )
}

export function BestSpotsDrawer() {
  const [isExpanded, setIsExpanded] = useState(false)
  const touchStartY = useRef(0)
  const { spots, isLoading } = useBestSpots()

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaY = e.changedTouches[0].clientY - touchStartY.current
    if (deltaY < -60) setIsExpanded(true)
    if (deltaY > 60) setIsExpanded(false)
  }

  return (
    <div
      id="best-spots-drawer-container"
      className={isExpanded ? 'expanded' : ''}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div id="best-spots-drawer">
        {isExpanded ? (
          <div id="drawer-full-header">
            <button id="drawer-back-btn" onClick={() => setIsExpanded(false)}>
              <svg
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <h2 id="drawer-full-title">BEST 심령스팟</h2>
          </div>
        ) : (
          <>
            <div id="drawer-handle-wrap">
              <div id="drawer-handle" />
            </div>
            <div id="drawer-compact-header">
              <span id="drawer-dot" />
              <h2 id="drawer-title">BEST 심령 스팟</h2>
            </div>
          </>
        )}

        <div id="drawer-content">
          {isLoading ? (
            <p id="drawer-loading">불러오는 중…</p>
          ) : isExpanded ? (
            <div id="drawer-grid">
              {spots.map((spot, i) => (
                <GridCard key={spot.id} spot={spot} rank={i + 1} />
              ))}
            </div>
          ) : (
            <div id="drawer-horizontal-list">
              {spots.slice(0, 3).map((spot, i) => (
                <CompactCard key={spot.id} spot={spot} rank={i + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
