import { Bag } from "@paperbits/common/bag";

export class VideoPlayerModel {
    public sourceKey?: string;
    public controls?: boolean;
    public autoplay?: boolean;
    public styles: Bag<string>;
}