import { useEffect, useState } from 'react'
import { fetchBestSpots, type BestSpotItem } from '../../../apis/spot'

export function useBestSpots() {
  const [spots, setSpots] = useState<BestSpotItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    fetchBestSpots()
      .then(setSpots)
      .catch((err) => setError(err instanceof Error ? err.message : '불러오기 실패'))
      .finally(() => setIsLoading(false))
  }, [])

  return { spots, isLoading, error }
}
