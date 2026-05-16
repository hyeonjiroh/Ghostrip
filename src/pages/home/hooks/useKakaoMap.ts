import { useCallback, useEffect, useRef, useState } from 'react';

import { DEFAULT_LAT, DEFAULT_LNG, DEFAULT_LEVEL } from '../../../constants';

const MY_LOCATION_CONTENT = `
  <div class="spot-overlay">
    <div class="spot-overlay-label">내 위치</div>
    <svg class="spot-overlay-pin-bare" viewBox="0 0 32 37" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 18.5C16.6875 18.5 17.276 18.2552 17.7656 17.7656C18.2552 17.276 18.5 16.6875 18.5 16C18.5 15.3125 18.2552 14.724 17.7656 14.2344C17.276 13.7448 16.6875 13.5 16 13.5C15.3125 13.5 14.724 13.7448 14.2344 14.2344C13.7448 14.724 13.5 15.3125 13.5 16C13.5 16.6875 13.7448 17.276 14.2344 17.7656C14.724 18.2552 15.3125 18.5 16 18.5ZM16 31C12.6458 28.1458 10.1406 25.4948 8.48438 23.0469C6.82812 20.599 6 18.3333 6 16.25C6 13.125 7.00521 10.6354 9.01562 8.78125C11.026 6.92708 13.3542 6 16 6C18.6458 6 20.974 6.92708 22.9844 8.78125C24.9948 10.6354 26 13.125 26 16.25C26 18.3333 25.1719 20.599 23.5156 23.0469C21.8594 25.4948 19.3542 28.1458 16 31Z" fill="#EF4444"/>
    </svg>
  </div>
`;

export function useKakaoMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const myOverlayRef = useRef<kakao.maps.CustomOverlay | null>(null);
  const userPosRef = useRef<{ lat: number; lng: number }>({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
  const [isMapReady, setIsMapReady] = useState(false);
  const resizeHandlerRef = useRef<(() => void) | null>(null);

  const createMap = useCallback((lat: number, lng: number) => {
    if (!mapContainerRef.current || mapRef.current) return;

    userPosRef.current = { lat, lng };
    const center = new window.kakao.maps.LatLng(lat, lng);
    const map = new window.kakao.maps.Map(mapContainerRef.current, {
      center,
      level: DEFAULT_LEVEL,
    });
    mapRef.current = map;

    myOverlayRef.current = new window.kakao.maps.CustomOverlay({
      position: center,
      content: MY_LOCATION_CONTENT,
      map,
      xAnchor: 0.5,
      yAnchor: 1.0,
    });

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

  const updateMyLocation = useCallback((lat: number, lng: number) => {
    if (!mapRef.current) return;

    userPosRef.current = { lat, lng };
    const pos = new window.kakao.maps.LatLng(lat, lng);
    mapRef.current.setCenter(pos);

    myOverlayRef.current?.setMap(null);

    myOverlayRef.current = new window.kakao.maps.CustomOverlay({
      position: pos,
      content: MY_LOCATION_CONTENT,
      map: mapRef.current,
      xAnchor: 0.5,
      yAnchor: 1.0,
    });
  }, []);

  const resetView = useCallback(() => {
    if (!mapRef.current) return;
    const { lat, lng } = userPosRef.current;
    mapRef.current.setCenter(new window.kakao.maps.LatLng(lat, lng));
    mapRef.current.setLevel(DEFAULT_LEVEL);
  }, []);

  useEffect(() => {
    const init = () => {
      window.kakao.maps.load(() => {
        if (!navigator.geolocation) {
          createMap(DEFAULT_LAT, DEFAULT_LNG);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            createMap(pos.coords.latitude, pos.coords.longitude);

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

  return { mapContainerRef, mapRef, isMapReady, resetView };
}
