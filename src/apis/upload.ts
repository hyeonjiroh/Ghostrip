import axios from 'axios'
import { apiClient } from './client'
import type { ApiResponse } from '../types/api'

export interface PresignedUrlResponse {
  presignedUrl: string
  imageUrl: string
}

export interface SpotImageItem {
  spotImageId: number
  imageUrl: string
}

/**
 * S3 업로드용 presigned URL 발급
 * POST /api/s3/presigned-url
 */
export async function getPresignedUrl(
  prefix: string,
  fileName: string,
): Promise<PresignedUrlResponse> {
  const { data } = await apiClient.post<ApiResponse<PresignedUrlResponse>>(
    '/api/s3/presigned-url',
    { prefix, fileName },
  )
  if (!data.success || !data.data) {
    throw new Error(data.error?.message ?? 'presigned-url 발급 실패')
  }
  return data.data
}

/**
 * presigned URL로 실제 파일을 S3에 PUT 업로드
 * baseURL/인터셉터를 우회하기 위해 별도 axios 인스턴스 사용
 */
export async function putFileToS3(presignedUrl: string, file: File): Promise<void> {
  await axios.put(presignedUrl, file, {
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
    timeout: 240_000,
  })
}

/**
 * 심령스팟에 이미지 URL 목록 등록
 * POST /api/spot/{spotId}/image
 */
export async function registerSpotImages(
  spotId: number | string,
  imageUrlList: string[],
): Promise<SpotImageItem[]> {
  const { data } = await apiClient.post<ApiResponse<SpotImageItem[]>>(
    `/api/spot/${spotId}/image`,
    { imageUrlList },
  )
  if (!data.success || !data.data) {
    throw new Error(data.error?.message ?? '스팟 이미지 등록 실패')
  }
  return data.data
}

export interface UploadProgressEvent {
  file: File
  index: number
  total: number
  imageUrl: string
}

/**
 * 여러 파일을 S3에 업로드한 뒤 spot에 등록까지 한 번에 처리
 *
 * prefix는 "spotImage" 고정, fileName은 원본 그대로(확장자 포함) 사용.
 *
 * @param spotId         이미지를 등록할 스팟 ID
 * @param files          업로드할 파일 목록 (multiple)
 * @param onFileUploaded 파일 1개 업로드 완료 시점 콜백 (진행률 UI용)
 */
export async function uploadSpotImages(
  spotId: number | string,
  files: File[],
  onFileUploaded?: (event: UploadProgressEvent) => void,
): Promise<SpotImageItem[]> {
  const total = files.length
  const imageUrls: string[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const { presignedUrl, imageUrl } = await getPresignedUrl('spotImage', file.name)
    await putFileToS3(presignedUrl, file)
    imageUrls.push(imageUrl)
    onFileUploaded?.({ file, index: i, total, imageUrl })
  }

  return registerSpotImages(spotId, imageUrls)
}
