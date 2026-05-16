export const DEFAULT_LAT = 37.5665;
export const DEFAULT_LNG = 126.978;
export const DEFAULT_LEVEL = 3;

export const BEST_SPOTS = [
  { id: 1, name: '살목지' },
  { id: 2, name: '장산' },
  { id: 3, name: '돈내코 계곡' },
] as const;

export const SPOT_IMAGES: Record<string, string> = {
  '살목지': '/images/salmokji.png',
  '부산 장산': '/images/jangsan.png',
  '장산': '/images/jangsan.png',
  '돈내코 계곡': '/images/donnaeko.png',
  '상유곡지': '/images/sangyugok.png',
  '선녀곡지': '/images/seonnyeogok.png',
  '선녀곡': '/images/seonnyeogok.png',
};

export function getSpotImage(name: string): string | undefined {
  const norm = (s: string) => s.replace(/\s/g, '');
  const normName = norm(name);
  for (const [key, url] of Object.entries(SPOT_IMAGES)) {
    if (normName === norm(key)) return url;
  }
  return undefined;
}
