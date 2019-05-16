import { WidgetModel } from "@paperbits/common/widgets";
import { Breakpoints } from "@paperbits/common";

export class GridCellModel implements WidgetModel {
    public role: string;
    public styles?: Object;
    public widgets?: WidgetModel[];
    public position?: Breakpoints;

    constructor() {
        this.role = "article";
        this.widgets = [];
        this.styles = {};
    }
}