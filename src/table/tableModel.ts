import { TableCellModel } from "../table-cell";
import { LocalStyles } from "@paperbits/common/styles";

export class TableModel {
    public widgets: TableCellModel[];
    public styles?: LocalStyles;
    public numOfCols: number;
    public numOfRows: number;

    constructor() {
        this.styles = {};
        this.widgets = [];
    }
}