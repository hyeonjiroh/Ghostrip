/** POST /api/comment/{spotId} — 공포 지수(voteFearLevel) 허용 범위 */
export const VOTE_FEAR_LEVEL_MIN = 0
export const VOTE_FEAR_LEVEL_MAX = 5

export type VoteFearLevelParseResult =
  | { ok: true; voteFearLevel: number }
  | { ok: false; message: string }

/** 입력 문자열 → 0.0~5.0 (소수 첫째 자리) */
export function parseVoteFearLevelInput(input: string): VoteFearLevelParseResult {
  const normalized = input.trim().replace(',', '.')
  if (!normalized) {
    return { ok: false, message: '공포 지수를 입력해 주세요.' }
  }

  if (!/^\d+(\.\d)?$/.test(normalized)) {
    return {
      ok: false,
      message: '공포 지수는 0.0~5.0 사이, 소수점 첫째 자리까지 입력해 주세요.',
    }
  }

  const value = Number(normalized)
  if (!Number.isFinite(value) || value < VOTE_FEAR_LEVEL_MIN || value > VOTE_FEAR_LEVEL_MAX) {
    return { ok: false, message: '공포 지수는 0.0~5.0 사이로 입력해 주세요.' }
  }

  return { ok: true, voteFearLevel: value }
}

/** API 숫자 정규화 (부동소수점 오차만 보정) */
export function toVoteFearLevelValue(value: number): number {
  return Math.round(value * 10) / 10
}
