import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSpotById, type SpotDetailResult } from '../../../apis/spot';
import { BEST_SPOTS } from '../../../constants';
import type { PlaceResult } from '../hooks/useSearch';

interface SpotSearchDrawerProps {
  activePlace: PlaceResult | null;
}

export function SpotSearchDrawer({ activePlace }: SpotSearchDrawerProps) {
  const navigate = useNavigate();
  const [spotData, setSpotData] = useState<SpotDetailResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!activePlace) {
      setSpotData(null);
      return;
    }

    const matched = BEST_SPOTS.find((s) => s.name === activePlace.place_name);
    if (!matched) {
      setSpotData(null);
      return;
    }

    setIsLoading(true);
    fetchSpotById(String(matched.id))
      .then(setSpotData)
      .catch(() => setSpotData(null))
      .finally(() => setIsLoading(false));
  }, [activePlace]);

  if (!activePlace) return null;

  const description = spotData?.spot.description;
  const spotId = spotData?.spot.id;
  const spotName = activePlace.place_name;

  return (
    <div id="spot-search-drawer-container">
      <div id="spot-search-drawer">
        {isLoading ? (
          <p id="spot-search-loading">불러오는 중…</p>
        ) : (
          <>
            <div id="spot-search-info">
              <div id="spot-search-title-row">
                <span id="spot-search-dot" />
                <p id="spot-search-name">{spotName}</p>
              </div>
              {description && <p id="spot-search-desc">{description}</p>}
              {spotId && (
                <div id="spot-search-link-wrap">
                  <button id="spot-search-link" onClick={() => navigate(`/spots/${spotId}`)}>
                    자세히 알아보기 &gt;
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
