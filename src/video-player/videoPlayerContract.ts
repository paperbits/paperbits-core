import { Contract } from "@paperbits/common/contract";
import { LocalStyles } from "@paperbits/common/styles";

export interface VideoPlayerContract extends Contract {
    /**
     * Key of the permalink pointing to an actual resource.
     */
    sourceKey?: string;

    /**
     * External UR which is used when sourceKey isn't specified.
     */
    sourceUrl?: string;

    /**
     * Specifies if video player controls are shown.
     */
    controls?: boolean;

    /**
     * Specifies if video is muted by default.
     */
    muted?: boolean;

    /**
     * Specifies if video should play at start.
     */
    autoplay?: boolean;

    /**
     * Specifies an image to be shown while the video is downloading, or until the user hits the play button.
     */
    posterSourceKey?: string;

    /**
     * Widget styles.
     */
    styles?: LocalStyles;
}