import { GridCellModel } from "../grid-cell";
import { LocalStyles } from "@paperbits/common/styles";

export class GridModel {
    public widgets: GridCellModel[];
    public styles?: LocalStyles;

    constructor() {
        this.styles = {};
        this.widgets = [];
    }
}