import { apiClient } from './client'
import type { ApiResponse } from '../types/api'
import type { GhostSpot, RelatedContent } from '../types/spot'
import type { SpotDetailDto } from '../types/spotApi'

export interface SpotDetailResult {
  spot: GhostSpot
  relatedContents: RelatedContent[]
}

function mapFearLevelToHorrorIndex(fearLevel: number): number {
  const level = fearLevel <= 1 ? fearLevel * 5 : fearLevel
  return Math.min(5, Math.max(1, Math.round(level)))
}

function toGhostSpot(dto: SpotDetailDto): GhostSpot {
  const imageUrls = [...(dto.spotImageList ?? [])]
    .sort((a, b) => a.spotImageId - b.spotImageId)
    .map((img) => img.imageUrl)
    .filter(Boolean)

  return {
    id: String(dto.spotId),
    name: dto.name,
    imageUrl: imageUrls[0] ?? '',
    galleryImages: imageUrls,
    address: dto.kakaoPlace?.address ?? '',
    visitWarning: dto.visitWarning ?? '',
    viewCount: dto.viewCount,
    horrorIndex: mapFearLevelToHorrorIndex(dto.fearLevel),
    description: dto.description,
    kakaoPlaceUrl: dto.kakaoPlace?.kakaoPlaceUrl,
  }
}

function toRelatedContent(dto: SpotDetailDto['relatedContentList'][number]): RelatedContent {
  return {
    id: String(dto.relatedContentId),
    title: dto.title,
    thumbnailUrl: dto.thumbUrl,
    url: '#',
    source: '',
  }
}

export async function fetchSpotById(spotId: string): Promise<SpotDetailResult> {
  const { data } = await apiClient.get<ApiResponse<SpotDetailDto>>(`/api/spot/${spotId}`)

  if (!data.success || !data.data) {
    throw new Error(data.error?.message ?? '스팟 정보를 불러오지 못했습니다.')
  }

  return {
    spot: toGhostSpot(data.data),
    relatedContents: (data.data.relatedContentList ?? []).map(toRelatedContent),
  }
}
