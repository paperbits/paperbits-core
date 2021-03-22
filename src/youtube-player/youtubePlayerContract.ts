import { Contract } from "@paperbits/common/contract";
import { LocalStyles } from "@paperbits/common/styles";

export interface YoutubePlayerContract extends Contract {
    /**
     * Youtube clip ID, e.g. "M7lc1UVf-VE".
     */
    videoId: string;

    /**
     * Indicates whether player controls need to be shown.
     */
    controls?: boolean;

    /**
     * Indicates whether the clip needs to be played on start.
     */
    autoplay?: boolean;

    /**
     * Indicates whether the clip needs to be played in the loop.
     */
    loop?: boolean;

    /**
     * Widget styles.
     */
    styles?: LocalStyles;
}