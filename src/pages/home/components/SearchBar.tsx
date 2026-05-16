import type { PlaceResult } from '../hooks/useSearch';

interface SearchBarProps {
  onOpen: () => void;
  activePlace?: PlaceResult | null;
  onReset?: () => void;
}

export default function SearchBar({ onOpen, activePlace, onReset }: SearchBarProps) {
  const address = activePlace
    ? (activePlace.road_address_name || activePlace.address_name)
    : null;

  return (
    <div id="search-trigger" onClick={!activePlace ? onOpen : undefined}>
      {activePlace ? (
        <button
          id="search-back-btn"
          onClick={(e) => {
            e.stopPropagation();
            onReset?.();
          }}
        >
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      ) : null}

      <span id="search-trigger-text" className={activePlace ? 'active-address' : ''}>
        {address ?? '심령 스팟 검색하기'}
      </span>

      <svg
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        style={{ flexShrink: 0 }}
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    </div>
  );
}
