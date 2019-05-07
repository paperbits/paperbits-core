import { Contract, Breakpoints } from "@paperbits/common";

export interface CardContract extends Contract {
    alignment?: Breakpoints;
    overflowX?: string;
    overflowY?: string;
    styles: any;
}