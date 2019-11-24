import { WidgetModel } from "@paperbits/common/widgets";
import { Breakpoints } from "@paperbits/common";
import { LocalStyles } from "@paperbits/common/styles";

export class ColumnModel implements WidgetModel {
    public widgets: WidgetModel[];
    public size: Breakpoints;
    public alignment: Breakpoints;
    public offset: Breakpoints;
    public order: Breakpoints;
    public overflowX: string;
    public overflowY: string;
    public styles: LocalStyles;

    constructor() {
        this.widgets = [];
        this.size = {};
        this.alignment = {};
        this.order = {};
    }
}