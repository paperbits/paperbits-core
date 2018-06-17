import { Contract } from "@paperbits/common";
import { BackgroundContract } from "@paperbits/common/ui";

export interface SectionConfig extends Contract {
    background?: BackgroundContract;

    /**
     *  Layout types: container, full width.
     */
    layout?: string;

    /**
     * by content, screen size
     */
    height?: string;

    /**
     * Possible values: top, bottom.
     */
    snapping: string;
}