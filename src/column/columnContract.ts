import { Contract, Breakpoints } from "@paperbits/common";

export interface ColumnContract extends Contract {
    size?: Breakpoints;
    alignment?: Breakpoints;
    overflowX?: string;
    overflowY?: string;
}