import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  computeAverageVoteFearLevel,
  createCommentBySpotId,
  fetchCommentsBySpotId,
  parseVoteFearLevelInput,
  resolvePerceivedHorrorLevel,
} from '../../../apis/comment'
import type { SpotComment } from '../../../types/spot'

interface UseSpotCommentsOptions {
  spotFearLevel?: number
  onCommentCreated?: () => void | Promise<void>
}

export function useSpotComments(
  spotId: string | undefined,
  options?: UseSpotCommentsOptions,
) {
  const [comments, setComments] = useState<SpotComment[]>([])
  const [newComment, setNewComment] = useState('')
  const [newVoteFearLevel, setNewVoteFearLevel] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const loadComments = useCallback(async () => {
    if (!spotId) {
      setComments([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const list = await fetchCommentsBySpotId(spotId)
      setComments(list)
    } catch (err) {
      setComments([])
      setError(err instanceof Error ? err.message : '댓글을 불러오지 못했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [spotId])

  useEffect(() => {
    loadComments()
  }, [loadComments])

  const handleSubmit = async (): Promise<boolean> => {
    const trimmed = newComment.trim()
    if (!trimmed || !spotId || isSubmitting) return false

    const parsedVoteFearLevel = parseVoteFearLevelInput(newVoteFearLevel)
    if (!parsedVoteFearLevel.ok) {
      setSubmitError(parsedVoteFearLevel.message)
      return false
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const voteFearLevel = parsedVoteFearLevel.voteFearLevel
      const comment = await createCommentBySpotId(spotId, {
        content: trimmed,
        voteFearLevel,
      })
      setComments((prev) => [...prev, { ...comment, voteFearLevel }])
      setNewComment('')
      setNewVoteFearLevel('')
      await options?.onCommentCreated?.()
      return true
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : '댓글을 등록하지 못했습니다.')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  const averageVoteFearLevel = useMemo(
    () => computeAverageVoteFearLevel(comments),
    [comments],
  )

  const perceivedHorrorLevel = useMemo(
    () =>
      resolvePerceivedHorrorLevel(comments, averageVoteFearLevel, options?.spotFearLevel),
    [comments, averageVoteFearLevel, options?.spotFearLevel],
  )

  const canSubmit =
    Boolean(newComment.trim()) && parseVoteFearLevelInput(newVoteFearLevel).ok && !isSubmitting

  return {
    comments,
    averageVoteFearLevel,
    perceivedHorrorLevel,
    newComment,
    setNewComment,
    newVoteFearLevel,
    setNewVoteFearLevel,
    isLoading,
    isSubmitting,
    canSubmit,
    error,
    submitError,
    handleSubmit,
    refetchComments: loadComments,
  }
}
