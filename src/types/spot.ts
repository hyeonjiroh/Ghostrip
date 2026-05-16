export interface GhostSpot {
  id: string
  name: string
  imageUrl: string
  galleryImages: string[]
  address: string
  visitWarning: string
  viewCount?: number
  /** API fearLevel (0.0~5.0) — 체감 공포도 표시용 */
  fearLevel: number
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
  voteFearLevel: number
  createdAt: string
}
