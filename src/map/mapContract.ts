import { Contract } from "@paperbits/common";
import { Geolocation } from "@paperbits/common/geocoding";
import { LocalStyles } from "@paperbits/common/styles";
import { GoogleMapsCustomization } from "./googleMapCustomization";

export interface MapMarkerContract {
    sourceKey: string;
    width?: string;
    height?: string;
    popupKey?: string;
}

export interface MapCustomizations {
    styles: GoogleMapsCustomization[];
}

export interface MapContract extends Contract {
    /**
     * Location shown on the map, e.g. "Seattle, WA".
     */
    location: string | Geolocation;

    /**
     * Location pin caption, e.g. "Space needle".
     */
    caption?: string;

    /**
     * Map zoom level (min 1, max 22).
     */
    zoom?: number;

    /**
     * Map type, e.g. "terrain", "satellite" or "hybrid".
     */
    mapType?: string;

    /**
     * Marker icon.
     */
    marker?: MapMarkerContract;

    /**
     * Widget local styles.
     */
    styles?: LocalStyles;

    /**
     * Map customizations (depends on map type).
     */
    customizations?: MapCustomizations;
}