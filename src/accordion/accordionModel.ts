import { WidgetModel } from "@paperbits/common/widgets";
import { LocalStyles } from "@paperbits/common/styles";

export class AccordionModel {
    public accordionItems: AccordionItemModel[];
    public styles: LocalStyles;

    constructor() {
        this.styles = {};
        this.accordionItems = [];
    }
}

export class AccordionItemModel implements WidgetModel {
    public widgets: WidgetModel[];
    public styles: LocalStyles;
    public label: string;

    constructor(label: string = "Item") {
        this.styles = {};
        this.widgets = [];
        this.label = label;
    }
}
