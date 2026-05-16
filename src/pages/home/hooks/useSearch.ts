import { useCallback, useEffect, useRef, useState } from 'react';

import { SPOT_IMAGES } from '../../../constants';

export interface PlaceResult {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name: string;
  x: string;
  y: string;
}

const PIN_PATH =
  'M16 18.5C16.6875 18.5 17.276 18.2552 17.7656 17.7656C18.2552 17.276 18.5 16.6875 18.5 16C18.5 15.3125 18.2552 14.724 17.7656 14.2344C17.276 13.7448 16.6875 13.5 16 13.5C15.3125 13.5 14.724 13.7448 14.2344 14.2344C13.7448 14.724 13.5 15.3125 13.5 16C13.5 16.6875 13.7448 17.276 14.2344 17.7656C14.724 18.2552 15.3125 18.5 16 18.5ZM16 31C12.6458 28.1458 10.1406 25.4948 8.48438 23.0469C6.82812 20.599 6 18.3333 6 16.25C6 13.125 7.00521 10.6354 9.01562 8.78125C11.026 6.92708 13.3542 6 16 6C18.6458 6 20.974 6.92708 22.9844 8.78125C24.9948 10.6354 26 13.125 26 16.25C26 18.3333 25.1719 20.599 23.5156 23.0469C21.8594 25.4948 19.3542 28.1458 16 31Z';

function createOverlayEl(name: string): HTMLDivElement {
  const imageUrl = SPOT_IMAGES[name];

  const pinHtml = imageUrl
    ? `<div class="spot-overlay-pin">
         <svg class="spot-overlay-pin-icon" viewBox="0 0 32 37" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path fill="currentColor" d="${PIN_PATH}"/>
         </svg>
       </div>`
    : `<svg class="spot-overlay-pin-bare" viewBox="0 0 32 37" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path fill="currentColor" d="${PIN_PATH}"/>
       </svg>`;

  const imageHtml = imageUrl
    ? `<div class="spot-overlay-image">
         <img src="${imageUrl}" style="width:100%;height:100%;object-fit:cover;display:block;" />
       </div>`
    : '';

  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div class="spot-overlay inactive">
      <div class="spot-overlay-label">${name}</div>
      ${pinHtml}
      ${imageHtml}
    </div>
  `.trim();

  return wrapper.firstElementChild as HTMLDivElement;
}

export function useSearch(
  mapRef: React.RefObject<kakao.maps.Map | null>,
  isMapReady: boolean
) {
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [activePlace, setActivePlace] = useState<PlaceResult | null>(null);
  const overlaysRef = useRef<kakao.maps.CustomOverlay[]>([]);
  const overlayElsRef = useRef<HTMLDivElement[]>([]);
  const resultsRef = useRef<PlaceResult[]>([]);
  const psRef = useRef<kakao.maps.services.Places | null>(null);

  const clearOverlays = useCallback(() => {
    overlaysRef.current.forEach((o) => o.setMap(null));
    overlaysRef.current = [];
    overlayElsRef.current = [];
  }, []);

  const resetSearch = useCallback(() => {
    clearOverlays();
    setResults([]);
    setActivePlace(null);
    resultsRef.current = [];
  }, [clearOverlays]);

  const activatePin = useCallback(
    (placeIdx: number) => {
      if (mapRef.current && overlaysRef.current[placeIdx]) {
        mapRef.current.setCenter(overlaysRef.current[placeIdx].getPosition());
        mapRef.current.setLevel(3);
      }
      overlayElsRef.current.forEach((overlayEl, j) => {
        overlayEl.classList.toggle('inactive', j !== placeIdx);
      });
      setActivePlace(resultsRef.current[placeIdx] ?? null);
    },
    [mapRef]
  );

  const search = useCallback(
    (keyword: string) => {
      if (!mapRef.current || !window.kakao?.maps?.services) return;

      if (!psRef.current) {
        psRef.current = new window.kakao.maps.services.Places();
      }

      psRef.current.keywordSearch(keyword, (searchResults, status) => {
        if (status === 'OK') {
          const places = searchResults as PlaceResult[];
          setResults(places);
          setActivePlace(null);
          resultsRef.current = places;
          clearOverlays();

          const bounds = new window.kakao.maps.LatLngBounds();
          places.forEach((place, placeIdx) => {
            const pos = new window.kakao.maps.LatLng(
              parseFloat(place.y),
              parseFloat(place.x)
            );

            const el = createOverlayEl(place.place_name);
            overlayElsRef.current.push(el);

            const overlay = new window.kakao.maps.CustomOverlay({
              position: pos,
              content: el,
              map: mapRef.current!,
              xAnchor: 0.5,
              yAnchor: 1.0,
            });

            overlaysRef.current.push(overlay);
            bounds.extend(pos);

            const pinEl = el.querySelector<HTMLElement>(
              '.spot-overlay-pin, .spot-overlay-pin-bare'
            );
            pinEl?.addEventListener('click', (e) => {
              e.stopPropagation();
              activatePin(placeIdx);
            });
          });

          if (places.length > 0) mapRef.current!.setBounds(bounds);
        } else {
          setResults([]);
          setActivePlace(null);
          resultsRef.current = [];
        }
      });
    },
    [mapRef, clearOverlays, activatePin]
  );

  const focusPlace = useCallback(
    (index: number) => {
      activatePin(index);
    },
    [activatePin]
  );

  useEffect(() => {
    if (!isMapReady || !mapRef.current) return;

    const map = mapRef.current;
    const geocoder = new window.kakao.maps.services.Geocoder();

    const handler = (mouseEvent: kakao.maps.MapMouseEvent) => {
      const latlng = mouseEvent.latLng;
      const lat = latlng.getLat();
      const lng = latlng.getLng();

      geocoder.coord2Address(lng, lat, (result, status) => {
        const roadAddr =
          status === 'OK' && result[0]?.road_address?.address_name
            ? result[0].road_address.address_name
            : '';
        const addr =
          status === 'OK' && result[0] ? result[0].address.address_name : '';
        const displayAddress = roadAddr || addr || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

        const clickedPlace: PlaceResult = {
          id: `click-${lat}-${lng}`,
          place_name: displayAddress,
          address_name: addr,
          road_address_name: roadAddr,
          x: String(lng),
          y: String(lat),
        };

        clearOverlays();
        setResults([]);
        resultsRef.current = [clickedPlace];

        // 클릭 위치 핀 (활성)
        const pos = new window.kakao.maps.LatLng(lat, lng);
        const el = createOverlayEl(displayAddress);
        el.classList.remove('inactive');
        overlayElsRef.current = [el];
        overlaysRef.current = [
          new window.kakao.maps.CustomOverlay({
            position: pos,
            content: el,
            map,
            xAnchor: 0.5,
            yAnchor: 1.0,
          }),
        ];

        setActivePlace(clickedPlace);

        // 주변 관광명소 검색 (비활성 핀으로 표시)
        if (!psRef.current) {
          psRef.current = new window.kakao.maps.services.Places();
        }
        psRef.current.categorySearch(
          'AT4',
          (nearbyResults, nearbyStatus) => {
            if (nearbyStatus !== 'OK') return;

            (nearbyResults as PlaceResult[]).forEach((nearby) => {
              const nearbyPos = new window.kakao.maps.LatLng(
                parseFloat(nearby.y),
                parseFloat(nearby.x)
              );
              const nearbyEl = createOverlayEl(nearby.place_name);
              // inactive 클래스는 createOverlayEl 에서 이미 추가됨

              const idx = overlayElsRef.current.length;
              overlayElsRef.current.push(nearbyEl);
              resultsRef.current.push(nearby);

              overlaysRef.current.push(
                new window.kakao.maps.CustomOverlay({
                  position: nearbyPos,
                  content: nearbyEl,
                  map,
                  xAnchor: 0.5,
                  yAnchor: 1.0,
                })
              );

              const pinEl = nearbyEl.querySelector<HTMLElement>(
                '.spot-overlay-pin, .spot-overlay-pin-bare'
              );
              pinEl?.addEventListener('click', (e) => {
                e.stopPropagation();
                activatePin(idx);
              });
            });
          },
          {
            location: new window.kakao.maps.LatLng(lat, lng),
            radius: 1000,
            size: 8,
          }
        );
      });
    };

    window.kakao.maps.event.addListener(
      map,
      'click',
      handler as (...args: unknown[]) => void
    );

    return () => {
      window.kakao.maps.event.removeListener(
        map,
        'click',
        handler as (...args: unknown[]) => void
      );
    };
  }, [isMapReady, clearOverlays, activatePin]);

  return { results, search, focusPlace, activePlace, resetSearch };
}
