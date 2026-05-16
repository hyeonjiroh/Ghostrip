import { useState } from 'react';

const STORAGE_KEY = 'recentSearches';
const MAX_COUNT = 10;

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  });

  const save = (keyword: string) => {
    const updated = [
      keyword,
      ...recentSearches.filter((k) => k !== keyword),
    ].slice(0, MAX_COUNT);
    setRecentSearches(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const remove = (keyword: string) => {
    const updated = recentSearches.filter((k) => k !== keyword);
    setRecentSearches(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return { recentSearches, save, remove };
}
