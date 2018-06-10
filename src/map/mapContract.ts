import { Contract } from "@paperbits/common";

export interface MapContract extends Contract {
    location: string;
    layout?: string;
    caption?: string;
    zoomControl?: string;
}