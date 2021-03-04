import { WidgetModel } from "@paperbits/common/widgets";
import { LocalStyles } from "@paperbits/common/styles";

export class CollapsiblePanelModel {
    public styles: LocalStyles;
    public widgets?: WidgetModel[];
    public version: string;

    constructor() {
        this.widgets = [];
        this.styles = {};
    }
}
