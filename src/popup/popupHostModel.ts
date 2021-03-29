import { WidgetModel } from "@paperbits/common/widgets";

export class PopupHostModel implements WidgetModel {
    public widgets: WidgetModel[];

    constructor() {
        this.widgets = [];
    }
}