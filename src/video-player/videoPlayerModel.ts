import { LocalStyles } from "@paperbits/common/styles";

export class VideoPlayerModel {
    public sourceKey?: string;
    public controls?: boolean;
    public autoplay?: boolean;
    public styles: LocalStyles;
    public posterSourceKey?: string;
    public muted?: boolean;

    constructor() {
        this.styles = {};
    }
}