import { Contract } from "@paperbits/common";
import { LocalStyles } from "@paperbits/common/styles";

export interface GridContract extends Contract {
    styles?: LocalStyles;
}