import type { GhostSpot, RelatedContent, SpotComment } from '../types/spot'

export const HORROR_LABELS = ['', '약간 으스스', '좀 무서움', '꽤 무서움', '매우 무서움', '공포 극한'] as const

export const HORROR_COLORS = ['', '#ADABAA', '#787776', '#EF4444', '#7F1C1D', '#7F1C1D'] as const

/** UI 표시용 — API 연동 시 GhostSpot 필드로 이전 */
export const SPOT_DISPLAY_META = {
  category: '곤지암',
  rating: 4.5,
} as const

/** @deprecated API 연동 후 제거 — GET /spots/:spotId 응답으로 대체 */
export const DUMMY_SPOT: GhostSpot = {
  id: '1',
  name: '곤지암 정신병원',
  imageUrl:
    'https://images.unsplash.com/photo-1638008944246-389bebaa0e08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
  galleryImages: [
    'https://images.unsplash.com/photo-1767779670896-a02bc4f0b5e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800',
    'https://images.unsplash.com/photo-1761410777083-0812af765065?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800',
    'https://images.unsplash.com/photo-1770493707137-7032de99db04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800',
    'https://images.unsplash.com/photo-1542940018-8768f81865f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800',
  ],
  address: '경기도 광주시 곤지암읍 경충대로 715',
  visitWarning: '사유지 또는 위험 구역으로 출입이 금지됩니다',
  horrorIndex: 5,
  description:
    '과거 원장이 환자들을 두고 도주했다는 괴담이 얽힌 폐병원. 경기도 광주시에 위치하며 CNN이 선정한 세계 7대 공포 명소에 오를 만큼 악명 높은 장소입니다. 폐쇄된 이후에도 인근 주민들로부터 이상한 소리와 불빛이 목격된다는 제보가 꾸준히 이어지고 있습니다.',
}

/** @deprecated API 연동 후 제거 — GET /spots/:spotId/related-contents 응답으로 대체 */
export const RELATED_CONTENTS: RelatedContent[] = [
  {
    id: 'rc1',
    title: '[어둑시니Pick] 영화 〈곤지암〉 실제 배경, 가면 어떻게 되나요?',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1662937599687-2db5ce600f56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400',
    url: '#',
    source: '어둑시니',
  },
  {
    id: 'rc2',
    title: '공포 명소 탐방기 — 곤지암에서 하룻밤을 보낸다면?',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1648311645935-5b56e7d9213c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400',
    url: '#',
    source: '공포탐험대',
  },
  {
    id: 'rc3',
    title: '한국 7대 공포 명소 완전 정복 — CNN이 선정한 그 장소들',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1772593547178-f740cbc861d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400',
    url: '#',
    source: '괴담채널',
  },
]

/** @deprecated API 연동 후 제거 — GET /spots/:spotId/comments 응답으로 대체 */
export const DUMMY_COMMENTS: SpotComment[] = [
  {
    id: 'c1',
    author: '고스트헌터',
    content: '어제 밤에 갔다가 이상한 소리 들음;;',
    createdAt: '2026-05-16',
  },
  {
    id: 'c2',
    author: '공포덕후99',
    content:
      '친구랑 둘이서 입구까지만 갔는데 갑자기 창문에서 뭔가 움직였어요... 다리 후들거려서 그냥 도망쳤습니다',
    createdAt: '2026-05-14',
  },
  {
    id: 'c3',
    author: '밤탐험가',
    content: '사유지라 출입 불가인데 경비도 있으니 무리하게 들어가려다 잡히면 진짜 큰일남 ㅋㅋ',
    createdAt: '2026-05-10',
  },
]
