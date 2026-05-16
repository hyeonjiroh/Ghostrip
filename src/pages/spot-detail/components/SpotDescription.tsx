import type { GhostSpot } from '../../../types/spot'

interface SpotDescriptionProps {
  spot: GhostSpot
}

export function SpotDescription({ spot }: SpotDescriptionProps) {
  return (
    <p className="px-4 text-sm leading-relaxed text-gray-4">{spot.description}</p>
  )
}
