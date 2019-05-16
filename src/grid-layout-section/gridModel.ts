import { GridCellModel } from "../grid-cell";

export class GridModel {
    public widgets: GridCellModel[];
    public container?: string;
    public padding?: string;
    public styles?: Object;

    constructor() {
        this.container = "container";
        this.padding = "with-padding";
        this.styles = {};
        this.widgets = [];
    }
}