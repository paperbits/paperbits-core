import { Contract } from "@paperbits/common";
import { LocalStyles } from "@paperbits/common/styles";

export interface PopupInstanceContract extends Contract {
    styles: LocalStyles;
    backdrop: boolean;
}