import { WidgetModel } from "@paperbits/common/widgets";

export class SectionModel {
    public widgets: WidgetModel[];
    public container: string;
    public padding: string;
    public styles: Object;

    constructor() {
        this.container = "container";
        this.padding = "with-padding";
        this.styles = {};
        this.widgets = [];
    }
}