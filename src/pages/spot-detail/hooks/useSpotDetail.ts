import { useCallback, useEffect, useState } from 'react'
import { fetchSpotById } from '../../../apis/spot'
import type { GhostSpot, RelatedContent } from '../../../types/spot'

export function useSpotDetail(spotId: string | undefined) {
  const [spot, setSpot] = useState<GhostSpot | null>(null)
  const [relatedContents, setRelatedContents] = useState<RelatedContent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadSpot = useCallback(async () => {
    if (!spotId) {
      setSpot(null)
      setRelatedContents([])
      setIsLoading(false)
      setError('스팟 ID가 없습니다.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await fetchSpotById(spotId)
      setSpot(result.spot)
      setRelatedContents(result.relatedContents)
    } catch (err) {
      setSpot(null)
      setRelatedContents([])
      setError(err instanceof Error ? err.message : '스팟 정보를 불러오지 못했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [spotId])

  useEffect(() => {
    loadSpot()
  }, [loadSpot])

  return { spot, relatedContents, isLoading, error, refetch: loadSpot }
}
