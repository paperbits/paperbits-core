import { WidgetModel } from "@paperbits/common/widgets";
import { StyleContract } from "@paperbits/common/styles/styleConfig";

export class SectionModel {
    public widgets: WidgetModel[];
    public container: string;
    public padding: string;
    public styles: StyleContract;

    constructor() {
        this.container = "container";
        this.padding = "with-padding";
        this.styles = null;
        this.widgets = [];
    }
}