import { useCallback, useRef, useState } from 'react';

export interface PlaceResult {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name: string;
  x: string;
  y: string;
}

export function useSearch(mapRef: React.RefObject<kakao.maps.Map | null>) {
  const [results, setResults] = useState<PlaceResult[]>([]);
  const markersRef = useRef<kakao.maps.Marker[]>([]);
  const psRef = useRef<kakao.maps.services.Places | null>(null);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
  }, []);

  const search = useCallback(
    (keyword: string) => {
      if (!mapRef.current || !window.kakao?.maps?.services) return;

      if (!psRef.current) {
        psRef.current = new window.kakao.maps.services.Places();
      }

      psRef.current.keywordSearch(keyword, (searchResults, status) => {
        if (status === 'OK') {
          setResults(searchResults as PlaceResult[]);
          clearMarkers();

          const bounds = new window.kakao.maps.LatLngBounds();
          searchResults.forEach((place) => {
            const pos = new window.kakao.maps.LatLng(
              parseFloat(place.y),
              parseFloat(place.x)
            );
            const marker = new window.kakao.maps.Marker({
              position: pos,
              map: mapRef.current!,
            });
            markersRef.current.push(marker);
            bounds.extend(pos);
          });

          if (searchResults.length > 0) mapRef.current!.setBounds(bounds);
        } else {
          setResults([]);
        }
      });
    },
    [mapRef, clearMarkers]
  );

  const focusPlace = useCallback(
    (index: number) => {
      if (!mapRef.current || !markersRef.current[index]) return;
      mapRef.current.setCenter(markersRef.current[index].getPosition());
      mapRef.current.setLevel(3);
    },
    [mapRef]
  );

  return { results, search, focusPlace };
}
