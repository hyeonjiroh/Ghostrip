import { apiClient } from './client'
import type { ApiResponse } from '../types/api'
import type { CommentDto } from '../types/comment'
import type { SpotComment } from '../types/spot'

function formatCommentDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso.slice(0, 10)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function toSpotComment(dto: CommentDto): SpotComment {
  return {
    id: dto.commentId,
    author: dto.userName,
    content: dto.content,
    createdAt: formatCommentDate(dto.createdAt),
  }
}

export async function fetchCommentsBySpotId(spotId: string): Promise<SpotComment[]> {
  const { data } = await apiClient.get<ApiResponse<CommentDto[]>>(`/api/comment/${spotId}`)

  if (!data.success) {
    throw new Error(data.error?.message ?? '댓글을 불러오지 못했습니다.')
  }

  const sorted = [...(data.data ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return sorted.map(toSpotComment)
}

export async function createCommentBySpotId(
  spotId: string,
  content: string,
): Promise<SpotComment> {
  const { data } = await apiClient.post<ApiResponse<CommentDto>>(`/api/comment/${spotId}`, {
    content,
  })

  if (!data.success || !data.data) {
    throw new Error(data.error?.message ?? '댓글을 등록하지 못했습니다.')
  }

  return toSpotComment(data.data)
}
