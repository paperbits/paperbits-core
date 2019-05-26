import { Contract } from "@paperbits/common/contract";

export interface NavbarContract extends Contract {
    rootKey: string;
    pictureSourceKey?: string;
    pictureWidth?: string | number;
    pictureHeight?: string | number;
    styles?: any;
}