import { LocalStyles } from "@paperbits/common/styles";

export class YoutubePlayerModel {
    public videoId: string;
    public origin?: string;
    public controls?: boolean;
    public autoplay?: boolean;
    public loop?: boolean;

    /**
     * Picture styles.
     */
    public styles: LocalStyles;
}