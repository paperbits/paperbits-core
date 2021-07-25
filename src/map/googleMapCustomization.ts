export interface GoogleMapsCustomization {
    /**
     * Feature type, e.g. `poi.park`.
     */
    featureType: string;

    /**
     * Type of element, e.g. `labels.text.fill`.
     */
    elementType: string;

    /**
     * Stylers.
     */
    stylers: any;
}