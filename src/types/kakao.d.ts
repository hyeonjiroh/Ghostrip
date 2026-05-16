declare namespace kakao {
  namespace maps {
    function load(callback: () => void): void;

    class Map {
      constructor(container: HTMLElement, options: MapOptions);
      setCenter(latlng: LatLng): void;
      getCenter(): LatLng;
      setLevel(level: number): void;
      getLevel(): number;
      setBounds(bounds: LatLngBounds): void;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      getLat(): number;
      getLng(): number;
    }

    class LatLngBounds {
      constructor(sw?: LatLng, ne?: LatLng);
      extend(latlng: LatLng): void;
      getSouthWest(): LatLng;
      getNorthEast(): LatLng;
    }

    class Marker {
      constructor(options: MarkerOptions);
      setMap(map: Map | null): void;
      getPosition(): LatLng;
      setTitle(title: string): void;
    }

    class CustomOverlay {
      constructor(options: CustomOverlayOptions);
      setMap(map: Map | null): void;
      getPosition(): LatLng;
    }

    class InfoWindow {
      constructor(options: InfoWindowOptions);
      open(map: Map, marker: Marker): void;
      close(): void;
      setContent(content: string): void;
    }

    interface MapOptions {
      center: LatLng;
      level: number;
    }

    interface MarkerOptions {
      position: LatLng;
      map?: Map;
      title?: string;
    }

    interface CustomOverlayOptions {
      position: LatLng;
      content: string | HTMLElement;
      map?: Map;
      xAnchor?: number;
      yAnchor?: number;
      zIndex?: number;
    }

    interface InfoWindowOptions {
      content: string;
      removable?: boolean;
    }

    interface MapMouseEvent {
      latLng: LatLng;
      point: { x: number; y: number };
    }

    namespace services {
      class Geocoder {
        coord2Address(
          lng: number,
          lat: number,
          callback: (result: Coord2AddressResult[], status: 'OK' | 'ZERO_RESULT' | 'ERROR') => void
        ): void;
      }

      interface Coord2AddressResult {
        road_address: {
          address_name: string;
          building_name?: string;
        } | null;
        address: {
          address_name: string;
        };
      }

      class Places {
        keywordSearch(
          keyword: string,
          callback: (
            result: PlaceSearchResult[],
            status: Status,
            pagination: Pagination
          ) => void,
          options?: PlaceSearchOptions
        ): void;
        categorySearch(
          code: string,
          callback: (
            result: PlaceSearchResult[],
            status: Status,
            pagination: Pagination
          ) => void,
          options?: PlaceSearchOptions
        ): void;
      }

      interface PlaceSearchResult {
        id: string;
        place_name: string;
        category_name: string;
        category_group_code: string;
        category_group_name: string;
        phone: string;
        address_name: string;
        road_address_name: string;
        x: string;
        y: string;
        place_url: string;
        distance: string;
      }

      interface PlaceSearchOptions {
        location?: LatLng;
        radius?: number;
        bounds?: LatLngBounds;
        category_group_code?: string;
        page?: number;
        size?: number;
        sort?: 'accuracy' | 'distance';
      }

      interface Pagination {
        totalCount: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
        current: number;
        gotoPage(page: number): void;
        nextPage(): void;
        prevPage(): void;
      }

      type Status = 'OK' | 'ZERO_RESULT' | 'ERROR';
    }

    namespace event {
      function addListener(
        target: object,
        type: string,
        handler: (...args: unknown[]) => void
      ): void;
      function removeListener(
        target: object,
        type: string,
        handler: (...args: unknown[]) => void
      ): void;
    }
  }
}

interface Window {
  kakao: typeof kakao;
}
