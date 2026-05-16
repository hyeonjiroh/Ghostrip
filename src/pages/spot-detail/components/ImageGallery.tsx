import { useEffect, useRef, useState } from 'react'
import { Images, Plus, X } from 'lucide-react'

const PREVIEW_COUNT = 3

interface ImageGalleryProps {
  images: string[]
  spotName: string
}

export function ImageGallery({ images: serverImages, spotName }: ImageGalleryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [showAllGallery, setShowAllGallery] = useState(false)

  useEffect(() => {
    setUploadedImages([])
  }, [serverImages])

  const images = [...serverImages, ...uploadedImages]

  const previewImages = images.slice(0, PREVIEW_COUNT)
  const fourthImage = images[PREVIEW_COUNT]
  const hasFourthSlot = images.length > PREVIEW_COUNT

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    const newUrls = Array.from(files).map((file) => URL.createObjectURL(file))
    setUploadedImages((prev) => [...prev, ...newUrls])
    e.target.value = ''
    // TODO(API): POST /spots/:spotId/gallery-images multipart 업로드
  }

  const openLightbox = (index: number) => {
    setShowAllGallery(false)
    setLightboxIndex(index)
  }

  return (
    <>
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Images size={15} className="text-spot-dim" />
            <h2 className="text-sm font-semibold text-white">현장 사진</h2>
            <span className="text-xs text-spot-dim">{images.length}장</span>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 rounded-lg border border-primary/50 bg-spot-surface px-3 py-1.5 text-xs font-medium text-secondary transition-colors hover:border-secondary hover:text-tertiary"
          >
            <Plus size={14} />
            사진 추가
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {previewImages.map((url, i) => (
              <button
                key={`${url}-${i}`}
                type="button"
                onClick={() => openLightbox(i)}
                className="group relative aspect-video overflow-hidden rounded-xl border border-primary/40 bg-spot-surface"
              >
                <img
                  src={url}
                  alt={`${spotName} 사진 ${i + 1}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </button>
            ))}

            {hasFourthSlot && fourthImage && (
              <button
                type="button"
                onClick={() => setShowAllGallery(true)}
                className="group relative aspect-video overflow-hidden rounded-xl border border-primary/40 bg-spot-surface"
              >
                <img
                  src={fourthImage}
                  alt={`${spotName} 사진 ${PREVIEW_COUNT + 1}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/55">
                  <span className="text-sm font-semibold text-white">
                    전체 {images.length}장
                  </span>
                </div>
              </button>
            )}
          </div>
        )}

        {images.length === 0 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 bg-spot-surface/50 py-10 text-spot-muted transition-colors hover:border-secondary/50 hover:text-spot-muted/80"
          >
            <Plus size={24} className="text-secondary" />
            <span className="text-sm">첫 현장 사진을 추가해 보세요</span>
          </button>
        )}
      </section>

      {showAllGallery && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/95"
          role="dialog"
          aria-modal="true"
          aria-label={`${spotName} 현장 사진 전체`}
        >
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
            <h3 className="text-base font-semibold text-white">
              현장 사진 <span className="text-spot-muted">({images.length}장)</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowAllGallery(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
              aria-label="닫기"
            >
              <X size={20} />
            </button>
          </div>
          <div className="spot-scroll flex-1 overflow-y-auto px-5 pb-6">
            <div className="grid grid-cols-2 gap-2">
              {images.map((url, i) => (
                <button
                  key={`all-${url}-${i}`}
                  type="button"
                  onClick={() => openLightbox(i)}
                  className="relative aspect-video overflow-hidden rounded-xl border border-primary/40"
                >
                  <img
                    src={url}
                    alt={`${spotName} 사진 ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${spotName} 사진 확대`}
        >
          <button
            type="button"
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
            onClick={() => setLightboxIndex(null)}
          >
            <X size={20} />
          </button>
          <img
            src={images[lightboxIndex]}
            alt={`${spotName} 사진 ${lightboxIndex + 1}`}
            className="max-h-[85vh] max-w-full rounded-xl border-2 border-secondary object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
