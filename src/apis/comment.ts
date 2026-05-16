import { apiClient } from './client'
import type { ApiResponse } from '../types/api'
import type {
  CommentDto,
  CreateCommentApiBody,
  CreateCommentPayload,
} from '../types/comment'
import type { SpotComment } from '../types/spot'
import { toVoteFearLevelValue } from '../utils/voteFearLevel'

export { parseVoteFearLevelInput } from '../utils/voteFearLevel'

function formatCommentDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso.slice(0, 10)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function resolveVoteFearLevel(dto: CommentDto): number {
  if (dto.voteFearLevel != null) return dto.voteFearLevel
  if (dto.fearLevel != null) return dto.fearLevel
  throw new Error('댓글 공포 지수(voteFearLevel)가 없습니다.')
}

function toSpotComment(dto: CommentDto, fallbackVoteFearLevel?: number): SpotComment {
  let voteFearLevel: number
  try {
    voteFearLevel = toVoteFearLevelValue(resolveVoteFearLevel(dto))
  } catch {
    if (fallbackVoteFearLevel == null) throw new Error('댓글 공포 지수(voteFearLevel)가 없습니다.')
    voteFearLevel = toVoteFearLevelValue(fallbackVoteFearLevel)
  }

  return {
    id: String(dto.commentId),
    author: dto.userName,
    content: dto.content,
    voteFearLevel,
    createdAt: formatCommentDate(dto.createdAt),
  }
}

/** voteFearLevel → 서버 POST 필드 fearLevel */
function toCreateCommentApiBody(payload: CreateCommentPayload): CreateCommentApiBody {
  return {
    content: payload.content.trim(),
    fearLevel: toVoteFearLevelValue(payload.voteFearLevel),
  }
}

function assertApiSuccess<T>(data: ApiResponse<T>, fallbackMessage: string): T {
  if (!data.success || data.data == null) {
    throw new Error(data.error?.message ?? fallbackMessage)
  }
  return data.data
}

/** 스팟 댓글 voteFearLevel 평균 (댓글 없으면 null) */
export function computeAverageVoteFearLevel(comments: SpotComment[]): number | null {
  if (comments.length === 0) return null

  const sum = comments.reduce((acc, comment) => acc + comment.voteFearLevel, 0)
  return toVoteFearLevelValue(sum / comments.length)
}

export async function fetchCommentsBySpotId(spotId: string): Promise<SpotComment[]> {
  const { data } = await apiClient.get<ApiResponse<CommentDto[]>>(`/api/comment/${spotId}`)
  const list = assertApiSuccess(data, '댓글을 불러오지 못했습니다.')

  const sorted = [...list].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )

  return sorted.map(toSpotComment)
}

export async function createCommentBySpotId(
  spotId: string,
  payload: CreateCommentPayload,
): Promise<SpotComment> {
  const body = toCreateCommentApiBody(payload)
  const { data } = await apiClient.post<ApiResponse<CommentDto>>(`/api/comment/${spotId}`, body)

  const dto = assertApiSuccess(data, '댓글을 등록하지 못했습니다.')
  return toSpotComment(dto, payload.voteFearLevel)
}

/** 댓글 평균 우선, 없으면 스팟 API fearLevel */
export function resolvePerceivedHorrorLevel(
  comments: SpotComment[],
  averageVoteFearLevel: number | null,
  spotFearLevel: number | undefined,
): number | null {
  if (comments.length > 0 && averageVoteFearLevel != null) {
    return averageVoteFearLevel
  }
  if (spotFearLevel != null) {
    return toVoteFearLevelValue(spotFearLevel)
  }
  return null
}
