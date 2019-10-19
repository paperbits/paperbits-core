import { Bag } from "@paperbits/common";
import { WidgetModel } from "@paperbits/common/widgets";

export class CollapsiblePanelModel {
    public styles: Bag<string>;
    public widgets?: WidgetModel[];

    constructor() {
        this.widgets = [];
        this.styles = {};
    }
}
