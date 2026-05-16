import { apiClient } from './client'
import type { ApiResponse } from '../types/api'

export interface ImageConvertResponse {
  convertedImageUrl: string
}

/**
 * 인물 + 심령스팟 배경 합성
 * POST /api/spot/convert/image/human-bg
 *
 * 두 URL 모두 사전에 S3 presigned URL 흐름으로 업로드한 결과 imageUrl 이어야 함.
 */
export async function convertHumanBg(params: {
  personImageUrl: string
  spotImageUrl: string
}): Promise<ImageConvertResponse> {
  const { data } = await apiClient.post<ApiResponse<ImageConvertResponse>>(
    '/api/spot/convert/image/human-bg',
    params,
    { timeout: 360_000 },
  )
  if (!data.success || !data.data) {
    throw new Error(data.error?.message ?? '합성 이미지 생성에 실패했습니다.')
  }
  return data.data
}

/**
 * 배경 분위기 변환 (심령사진 톤)
 * POST /api/spot/convert/image/mood
 */
export async function convertMood(params: {
  backgroundImageUrl: string
}): Promise<ImageConvertResponse> {
  const { data } = await apiClient.post<ApiResponse<ImageConvertResponse>>(
    '/api/spot/convert/image/mood',
    params,
    { timeout: 360_000 },
  )
  if (!data.success || !data.data) {
    throw new Error(data.error?.message ?? '분위기 변환에 실패했습니다.')
  }
  return data.data
}
