export interface SpotImageDto {
  spotImageId: number
  imageUrl: string
}

export interface KakaoPlaceDto {
  kakaoPlaceId: number
  address: string
  placeName: string
  kakaoPlaceUrl: string
}

export interface RelatedContentDto {
  relatedContentId: number
  title: string
  youtubeUrl: string
  thumbUrl: string
}

export interface SpotDetailDto {
  spotId: number
  name: string
  description: string
  fearLevel: number
  visitWarning: string
  viewCount: number
  spotImageList: SpotImageDto[]
  kakaoPlace: KakaoPlaceDto | null
  relatedContentList: RelatedContentDto[]
}
