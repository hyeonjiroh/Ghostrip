import { MapPin } from 'lucide-react'
import type { GhostSpot } from '../../../types/spot'

interface SpotLocationProps {
  spot: GhostSpot
}

export function SpotLocation({ spot }: SpotLocationProps) {
  return (
    <section className="space-y-4 rounded-xl border border-primary/30 bg-spot-surface/50 px-5 py-5">
      <h2 className="text-base font-semibold text-white">위치</h2>
      <div className="spot-text-box flex items-start gap-2.5">
        <MapPin size={16} className="mt-0.5 shrink-0 text-secondary" aria-hidden />
        <span className="text-sm text-spot-muted">{spot.address}</span>
      </div>
    </section>
  )
}
