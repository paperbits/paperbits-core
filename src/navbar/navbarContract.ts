import { Contract } from "@paperbits/common/contract";
import { LocalStyles } from "@paperbits/common/styles";

export interface NavbarContract extends Contract {
    rootKey: string;
    pictureSourceKey?: string;
    pictureWidth?: string | number;
    pictureHeight?: string | number;
    styles?: LocalStyles;
}