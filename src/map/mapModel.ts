import { LocalStyles } from "@paperbits/common/styles";
import { MapCustomizations } from "./mapContract";

export class MarkerModel {
    public sourceKey: string;
    public width: string;
    public height: string;
    public popupKey: string;

    constructor(sourceKey?: string) {
        this.sourceKey = sourceKey;
    }
}
export class MapModel {
    /**
     * Location shown on the map, e.g. "Seattle, WA"
     */
    public location: string;

    /**
     * Location pin caption, e.g. "Space needle".
     */
    public caption?: string;

    /**
     * Map zoom level.
     */
    public zoom?: number;

    /**
     * Map type, e.g. "terrain", "satellite" or "hybrid".
     */
    public mapType?: string;

    /**
     * Marker icon.
     */
    public marker: MarkerModel;

    /**
     * Widget local styles.
     */
    public styles: LocalStyles;

    /**
     * Map customizations (depends on map type).
     */
    public customizations?: MapCustomizations;

    constructor() {
        this.styles = {
            instance: {
                size: {
                    xs: {
                        width: 300,
                        height: 200
                    }
                }
            },
        };
    }
}