import { WidgetModel } from "@paperbits/common/widgets/widgetModel";

export class ContentModel {
    public type: string;
    public widgets: WidgetModel[];

    constructor() {
        this.widgets = [];
    }
}
