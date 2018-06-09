import { Contract } from "@paperbits/common/contract";

export interface PictureContract extends Contract {
    sourceKey?: string;
    sourceUrl?: string;
    caption?: string;
    action?: string;
    layout?: string;
    animation?: string;
}