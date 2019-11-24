import { Contract, Breakpoints } from "@paperbits/common";
import { LocalStyles } from "@paperbits/common/styles";

export interface CardContract extends Contract {
    alignment?: Breakpoints;
    overflowX?: string;
    overflowY?: string;
    styles: LocalStyles;
}