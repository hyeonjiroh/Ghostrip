interface SearchBarProps {
  onOpen: () => void;
}

export default function SearchBar({ onOpen }: SearchBarProps) {
  return (
    <div id="search-trigger" onClick={onOpen}>
      <span>심령 스팟 검색하기</span>
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
    </div>
  );
}
