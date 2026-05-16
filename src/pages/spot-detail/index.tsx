import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { EntryStatus } from './components/EntryStatus'
import { HorrorStars } from './components/HorrorStars'
import { SpotCommentsSection } from './components/SpotCommentsSection'
import { ImageGallery } from './components/ImageGallery'
import { RelatedContentSection } from './components/RelatedContentSection'
import { SpotDetailCard } from './components/SpotDetailCard'
import { SpotPageHeader } from './components/SpotPageHeader'
import { SpotVisual } from './components/SpotVisual'
import { useSpotComments } from './hooks/useSpotComments'
import { useSpotDetail } from './hooks/useSpotDetail'

export default function SpotPage() {
  const { spotId } = useParams<{ spotId: string }>()
  const relatedRef = useRef<HTMLElement>(null)

  const { spot, relatedContents, isLoading, error } = useSpotDetail(spotId)

  const {
    comments,
    newComment,
    setNewComment,
    isLoading: isCommentsLoading,
    isSubmitting,
    error: commentsError,
    submitError,
    handleSubmit,
  } = useSpotComments(spotId)

  const scrollToRelated = () => {
    relatedRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <p className="text-sm text-spot-dim">?? ??? ???? ?</p>
      </div>
    )
  }

  if (error || !spot) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-5">
        <p className="text-center text-sm text-primary">
          {error ?? '?? ??? ??? ? ????.'}
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen justify-center bg-black">
      <div className="spot-scroll w-full max-w-[360px] min-h-screen bg-black">
        <div className="relative">
          <div className="absolute top-0 right-0 left-0 z-10">
            <SpotPageHeader />
          </div>
          <SpotVisual spot={spot} />
        </div>

        <div className="flex flex-col gap-5 px-5 pb-14 pt-5">
          <SpotDetailCard spot={spot} onMoreLegend={scrollToRelated} />

          <EntryStatus visitWarning={spot.visitWarning} />

          <HorrorStars level={spot.horrorIndex} />

          <ImageGallery key={spot.id} images={spot.galleryImages} spotName={spot.name} />

          <RelatedContentSection ref={relatedRef} items={relatedContents} />

          <SpotCommentsSection
            comments={comments}
            newComment={newComment}
            isLoading={isCommentsLoading}
            isSubmitting={isSubmitting}
            error={commentsError}
            submitError={submitError}
            onNewCommentChange={setNewComment}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  )
}
