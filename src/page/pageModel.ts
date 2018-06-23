import { WidgetModel } from "@paperbits/common/widgets/WidgetModel";

export class PageModel {
    public title: string;
    public description: string;
    public keywords: string;
    public widgets: WidgetModel[];

    constructor() {
        this.widgets = [];
    }
}
