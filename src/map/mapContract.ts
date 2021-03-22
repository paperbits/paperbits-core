import { Contract } from "@paperbits/common";
import { LocalStyles } from "@paperbits/common/styles";

export interface MapContract extends Contract {
    /**
     * Location shown on the map, e.g. "Seattle, WA"
     */
    location: string;

    /**
     * Location pin caption, e.g. "Space needle".
     */
    caption?: string;

    /**
     * Map zoom level.
     */
    zoom?: number;

    /**
     * Map type, e.g. "terrain", "satellite" or "hybrid".
     */
    mapType?: string;

    /**
     * Widget local styles.
     */
    styles?: LocalStyles;
}