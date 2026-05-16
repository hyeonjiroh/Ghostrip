import { forwardRef } from 'react'
import type { RelatedContent } from '../../../types/spot'

interface RelatedContentSectionProps {
  items: RelatedContent[]
}

export const RelatedContentSection = forwardRef<HTMLElement, RelatedContentSectionProps>(
  function RelatedContentSection({ items }, ref) {
    if (items.length === 0) return null

    return (
      <section ref={ref} id="related-content" className="scroll-mt-4 space-y-4">
        <h2 className="text-sm font-semibold text-white">관련 콘텐츠</h2>
        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-w-0 flex-col gap-2"
            >
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-7">
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
              <div className="space-y-0.5 px-0.5">
                {item.source ? (
                  <span className="block text-[10px] text-spot-dim">{item.source}</span>
                ) : null}
                <p className="line-clamp-2 text-xs leading-snug text-gray-2">{item.title}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    )
  },
)
