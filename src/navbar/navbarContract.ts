import { Contract } from "@paperbits/common/contract";

export interface NavbarContract extends Contract {
    rootKey: string;
    sourceKey?: string;
}