export interface GhostSpot {
  id: string
  name: string
  imageUrl: string
  galleryImages: string[]
  address: string
  visitWarning: string
  viewCount?: number
  horrorIndex: number
  description: string
  kakaoPlaceUrl?: string
}

export interface RelatedContent {
  id: string
  title: string
  thumbnailUrl: string
  url: string
  source: string
}

export interface SpotComment {
  id: string
  author: string
  content: string
  createdAt: string
}
