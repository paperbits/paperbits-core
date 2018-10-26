import { WidgetModel } from "@paperbits/common/widgets/WidgetModel";
import { Breakpoints } from "@paperbits/common";

export class ColumnModel implements WidgetModel {
    public widgets: WidgetModel[];
    public size: Breakpoints;
    public alignment: Breakpoints;
    public order: Breakpoints;
    public overflowX: string;
    public overflowY: string;

    constructor() {
        this.widgets = [];
        this.size = {};
        this.alignment = {};
        this.order = {};
    }
}