export interface CommentDto {
  commentId: number
  userName: string
  content: string
  fearLevel: number
  voteFearLevel: number
  createdAt: string
}

/** 앱에서 댓글 등록 시 사용 (평점 = voteFearLevel) */
export interface CreateCommentPayload {
  content: string
  voteFearLevel: number
}

/** POST /api/comment/{spotId} — 서버 요청 스키마 (평점 필드명은 fearLevel) */
export interface CreateCommentApiBody {
  content: string
  fearLevel: number
}
