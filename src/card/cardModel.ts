import { WidgetModel } from "@paperbits/common/widgets";
import { Breakpoints } from "@paperbits/common";

export class CardModel implements WidgetModel {
    public widgets: WidgetModel[];
    public alignment: Breakpoints;
    public overflowX: string;
    public overflowY: string;
    public styles: Object;

    constructor() {
        this.widgets = [];
        this.alignment = {};
        this.styles = {};
    }
}