import { Breakpoints, Contract } from "@paperbits/common";
import { LocalStyles } from "@paperbits/common/styles";
import { TableCellContract } from "../table-cell/tableCellContract";


export interface TableConfig {
    rows: string[];
    rowGap?: string;
    columns: string[];
    columnGap?: string;
}

export interface TableContract extends Contract {
    table?: Breakpoints<TableConfig>;
    nodes: TableCellContract[];
    styles: LocalStyles;
    numOfCols: number;
    numOfRows: number;
}