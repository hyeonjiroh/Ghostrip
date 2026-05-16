import { useCallback, useEffect, useRef, useState } from 'react';

import { DEFAULT_LAT, DEFAULT_LNG, DEFAULT_LEVEL } from '../../../constants';

export function useKakaoMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const myMarkerRef = useRef<kakao.maps.Marker | null>(null);
  const infoWindowRef = useRef<kakao.maps.InfoWindow | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const resizeHandlerRef = useRef<(() => void) | null>(null);

  const createMap = useCallback((lat: number, lng: number) => {
    if (!mapContainerRef.current || mapRef.current) return;

    const center = new window.kakao.maps.LatLng(lat, lng);
    const map = new window.kakao.maps.Map(mapContainerRef.current, {
      center,
      level: DEFAULT_LEVEL,
    });
    mapRef.current = map;

    myMarkerRef.current = new window.kakao.maps.Marker({
      position: center,
      map,
    });
    infoWindowRef.current = new window.kakao.maps.InfoWindow({
      content:
        '<div style="padding:6px 10px;font-size:13px;white-space:nowrap;">📍 내 위치</div>',
    });
    infoWindowRef.current.open(map, myMarkerRef.current);

    const baseWidth = window.innerWidth;
    const baseLevel = map.getLevel();

    resizeHandlerRef.current = () => {
      (map as any).relayout();
      const ratio = window.innerWidth / baseWidth;
      const levelDelta = Math.round(Math.log2(ratio));
      map.setLevel(Math.min(14, Math.max(1, baseLevel - levelDelta)));
    };

    window.addEventListener('resize', resizeHandlerRef.current);
    setIsMapReady(true);
  }, []);

  // 마커·인포윈도우를 새 위치로 이동
  const updateMyLocation = useCallback((lat: number, lng: number) => {
    if (!mapRef.current) return;

    const pos = new window.kakao.maps.LatLng(lat, lng);
    mapRef.current.setCenter(pos);

    if (myMarkerRef.current) {
      myMarkerRef.current.setMap(null);
    }
    infoWindowRef.current?.close();

    myMarkerRef.current = new window.kakao.maps.Marker({
      position: pos,
      map: mapRef.current,
    });
    infoWindowRef.current = new window.kakao.maps.InfoWindow({
      content:
        '<div style="padding:6px 10px;font-size:13px;white-space:nowrap;">📍 내 위치</div>',
    });
    infoWindowRef.current.open(mapRef.current, myMarkerRef.current);
  }, []);

  useEffect(() => {
    const init = () => {
      window.kakao.maps.load(() => {
        if (!navigator.geolocation) {
          createMap(DEFAULT_LAT, DEFAULT_LNG);
          return;
        }

        // 1단계: enableHighAccuracy 없이 빠르게 초기 지도 생성
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            createMap(pos.coords.latitude, pos.coords.longitude);

            // 2단계: 고정밀 위치로 마커 갱신
            navigator.geolocation.getCurrentPosition(
              (accurate) => {
                updateMyLocation(
                  accurate.coords.latitude,
                  accurate.coords.longitude
                );
              },
              () => {},
              { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
            );
          },
          () => createMap(DEFAULT_LAT, DEFAULT_LNG),
          { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
        );
      });
    };

    if (window.kakao?.maps) {
      init();
      return;
    }

    const interval = setInterval(() => {
      if (window.kakao?.maps) {
        clearInterval(interval);
        init();
      }
    }, 100);

    return () => {
      clearInterval(interval);
      if (resizeHandlerRef.current) {
        window.removeEventListener('resize', resizeHandlerRef.current);
      }
    };
  }, [createMap, updateMyLocation]);

  return { mapContainerRef, mapRef, isMapReady };
}
