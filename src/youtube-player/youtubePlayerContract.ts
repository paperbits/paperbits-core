import { Contract } from "@paperbits/common/contract";

export interface YoutubePlayerContract extends Contract {
    videoId: string;
}