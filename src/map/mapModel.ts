import { LocalStyles } from "@paperbits/common/styles";

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
     * Widget local styles.
     */
    public styles: LocalStyles;

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