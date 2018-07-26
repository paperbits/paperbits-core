import { Contract } from "@paperbits/common/contract";

export interface YoutubePlayerContract extends Contract {
    videoId: string;
    origin?: string;
    controls?: boolean;
    autoplay?: boolean;
    loop?: boolean;
}