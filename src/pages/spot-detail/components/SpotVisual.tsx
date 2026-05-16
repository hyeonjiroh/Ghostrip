import type { GhostSpot } from '../../../types/spot'

interface SpotVisualProps {
  spot: GhostSpot
}

export function SpotVisual({ spot }: SpotVisualProps) {
  return (
    <section className="relative w-full">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <img
          src={spot.imageUrl}
          alt={spot.name}
          className="h-full w-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent"
          aria-hidden
        />

        <div className="absolute right-0 bottom-0 left-0 px-5 pb-5 pt-12">
          <h1 className="text-[28px] leading-tight font-bold tracking-tight text-white">
            {spot.name}
          </h1>
          <div className="mt-2.5 inline-flex max-w-full items-center gap-2 rounded-full bg-primary/90 px-3 py-1.5">
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-tertiary"
              aria-hidden
            />
            <span className="truncate text-[11px] leading-snug text-white">{spot.address}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
