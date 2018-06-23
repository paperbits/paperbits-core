import { WidgetModel } from "@paperbits/common/widgets";

export class LayoutModel {
    public type: string = "layout";
    public title: string;
    public description: string;   
    public uriTemplate: string;
    public widgets: WidgetModel[];

    constructor() {
        this.widgets = [];
    }
}
