import { WidgetModel } from "@paperbits/common/widgets";
import { Breakpoints } from "@paperbits/common";

export class ColumnModel implements WidgetModel {
    public widgets: WidgetModel[];
    public size: Breakpoints;
    public alignment: Breakpoints;
    public offset: Breakpoints;
    public order: Breakpoints;
    public overflowX: string;
    public overflowY: string;
    public styles: Object;

    constructor() {
        this.widgets = [];
        this.size = {};
        this.alignment = {};
        this.order = {};
    }
}