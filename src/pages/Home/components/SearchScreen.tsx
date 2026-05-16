import { type KeyboardEvent, useState } from 'react';

import { BEST_SPOTS } from '../../../constants';
import type { PlaceResult } from '../hooks/useSearch';

interface SearchScreenProps {
  results: PlaceResult[];
  recentSearches: string[];
  onSearch: (keyword: string) => void;
  onFocusPlace: (index: number) => void;
  onClose: () => void;
  onDeleteRecent: (keyword: string) => void;
}

export default function SearchScreen({
  results,
  recentSearches,
  onSearch,
  onFocusPlace,
  onClose,
  onDeleteRecent,
}: SearchScreenProps) {
  const [keyword, setKeyword] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (kw: string) => {
    if (!kw.trim()) return;
    setKeyword(kw);
    setShowResults(true);
    onSearch(kw.trim());
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch(keyword);
  };

  const handleClose = () => {
    setKeyword('');
    setShowResults(false);
    onClose();
  };

  return (
    <div id="search-screen">
      <div id="search-header">
        <button id="back-btn" onClick={handleClose}>
          <svg
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div id="search-input-wrap">
          <input
            id="search-input"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="심령 스팟 검색하기"
            autoComplete="off"
            autoFocus
          />
          <button id="search-btn" onClick={() => handleSearch(keyword)}>
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </div>
      </div>

      <div id="search-content">
        {!showResults ? (
          <div id="recent-section">
            <p className="section-title">최근 베스트</p>
            <div id="best-list">
              {BEST_SPOTS.map((spot) => (
                <div
                  key={spot.id}
                  className="best-item"
                  onClick={() => handleSearch(spot.name)}
                >
                  <span className="best-item-num">{spot.id}</span>
                  <span className="best-item-text">{spot.name}</span>
                </div>
              ))}
            </div>

            {recentSearches.length > 0 && (
              <>
                <div className="divider" />
                <div id="recent-list">
                  {recentSearches.map((kw) => (
                    <div key={kw} className="recent-item">
                      <span
                        className="recent-item-text"
                        onClick={() => handleSearch(kw)}
                      >
                        {kw}
                      </span>
                      <button
                        className="delete-btn"
                        onClick={() => onDeleteRecent(kw)}
                      >
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div id="search-results">
            {results.length === 0 ? (
              <p className="empty-msg">검색 결과가 없습니다.</p>
            ) : (
              results.map((place, i) => (
                <div
                  key={place.id}
                  className="result-item"
                  onClick={() => {
                    onFocusPlace(i);
                    handleClose();
                  }}
                >
                  <div className="result-name">{place.place_name}</div>
                  <div className="result-address">
                    {place.road_address_name || place.address_name}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
