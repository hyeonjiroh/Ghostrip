import { useCallback, useEffect, useState } from 'react'
import { createCommentBySpotId, fetchCommentsBySpotId } from '../../../apis/comment'
import type { SpotComment } from '../../../types/spot'

export function useSpotComments(spotId: string | undefined) {
  const [comments, setComments] = useState<SpotComment[]>([])
  const [newComment, setNewComment] = useState('')
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

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const comment = await createCommentBySpotId(spotId, trimmed)
      setComments((prev) => [comment, ...prev])
      setNewComment('')
      return true
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : '댓글을 등록하지 못했습니다.')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    comments,
    newComment,
    setNewComment,
    isLoading,
    isSubmitting,
    error,
    submitError,
    handleSubmit,
    refetchComments: loadComments,
  }
}
