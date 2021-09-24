export interface MapRuntimeConfig {
    /**
     * Google Maps API key.
     */
    apiKey: string;

    /**
     * Location shown on the map, e.g. "Seattle, WA".
     */
    location: string;

    /**
     * Location pin caption, e.g. "Space needle".
     */
    caption: string;

    /**
     * Map zoom level.
     */
    zoom: number;

    /**
     * Map type, e.g. "terrain", "satellite" or "hybrid".
     */
    mapType: string;

    /**
     * Marker icon URL.
     */
    markerIcon: string;

    /**
     * Marker popup key.
     */
    markerPopupKey?: string;

    /**
     * Map customizations (depends on map type).
     */
    customizations: any;
}