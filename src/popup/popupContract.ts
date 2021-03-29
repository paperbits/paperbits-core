import { Contract, Breakpoints } from "@paperbits/common";
import { LocalStyles } from "@paperbits/common/styles";

export interface PopupContract extends Contract {
    key: string;
    styles: LocalStyles;
    backdrop: boolean;
}