import { Breakpoints } from "@paperbits/common";
import { GridCellContract } from "../grid-cell/gridCellContract";


export interface GridConfig {
    rows: string[];
    rowGap?: string;
    columns: string[];
    columnGap?: string;
}

export interface GridContract {
    grid?: Breakpoints<GridConfig>;
    nodes: GridCellContract[];
}