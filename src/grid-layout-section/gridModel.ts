import { GridCellModel } from "../grid-cell";

export class GridModel {
    public widgets: GridCellModel[];
    public styles?: Object;

    constructor() {
        this.styles = {};
        this.widgets = [];
    }
}