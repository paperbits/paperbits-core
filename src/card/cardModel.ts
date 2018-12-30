import { WidgetModel } from "@paperbits/common/widgets";
import { Breakpoints } from "@paperbits/common";

export class CardModel implements WidgetModel {
    public widgets: WidgetModel[];
    public alignment: Breakpoints;
    public overflowX: string;
    public overflowY: string;

    constructor() {
        this.widgets = [];
        this.alignment = {};
    }
}