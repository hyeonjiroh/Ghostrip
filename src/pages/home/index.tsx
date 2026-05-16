import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useRecentSearches } from '@/hooks/useRecentSearches';
import { BestSpotsDrawer } from './components/BestSpotsDrawer';
import { SpotSearchDrawer } from './components/SpotSearchDrawer';
import SearchBar from './components/SearchBar';
import SearchScreen from './components/SearchScreen';
import { useKakaoMap } from './hooks/useKakaoMap';
import { useSearch } from './hooks/useSearch';

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const { mapContainerRef, mapRef, isMapReady, resetView } = useKakaoMap();
  const { results, search, focusPlace, activePlace, resetSearch } = useSearch(mapRef, isMapReady);
  const { recentSearches, save, remove } = useRecentSearches();

  const handleSearch = (keyword: string) => {
    save(keyword);
    search(keyword);
  };

  return (
    <>
      <div id="map" ref={mapContainerRef} />

      <div id="main-overlay">
        <SearchBar
          onOpen={() => setIsSearchOpen(true)}
          activePlace={activePlace}
          onReset={() => { resetSearch(); resetView(); }}
        />

        {!isSearchOpen && (
          <div id="photo-btn-wrap">
            <button id="photo-btn" onClick={() => navigate('/photo-generate')}>
              <svg
                width="20"
                height="18"
                viewBox="25 12 22 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M33.625 13.5L33.3906 13.8047L32.5 15H27.25V28.5H46.75V15H41.5L40.6094 13.8047L40.375 13.5H33.625ZM34.375 15H39.625L40.5156 16.1953L40.75 16.5H45.25V27H28.75V16.5H33.25L33.4844 16.1953L34.375 15ZM31 17.25C30.5869 17.25 30.25 17.5869 30.25 18C30.25 18.4131 30.5869 18.75 31 18.75C31.4131 18.75 31.75 18.4131 31.75 18C31.75 17.5869 31.4131 17.25 31 17.25ZM37 17.25C34.5244 17.25 32.5 19.2744 32.5 21.75C32.5 24.2256 34.5244 26.25 37 26.25C39.4756 26.25 41.5 24.2256 41.5 21.75C41.5 19.2744 39.4756 17.25 37 17.25ZM37 18.75C38.667 18.75 40 20.083 40 21.75C40 23.417 38.667 24.75 37 24.75C35.333 24.75 34 23.417 34 21.75C34 20.083 35.333 18.75 37 18.75Z"
                  fill="#C2A09E"
                />
              </svg>
              사진 생성하기
            </button>
          </div>
        )}
      </div>

      {activePlace ? (
        <SpotSearchDrawer activePlace={activePlace} />
      ) : (
        <BestSpotsDrawer />
      )}

      {isSearchOpen && (
        <SearchScreen
          results={results}
          recentSearches={recentSearches}
          onSearch={handleSearch}
          onFocusPlace={(i) => {
            focusPlace(i);
            setIsSearchOpen(false);
          }}
          onClose={() => setIsSearchOpen(false)}
          onDeleteRecent={remove}
        />
      )}
    </>
  );
}
