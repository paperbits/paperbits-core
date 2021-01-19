import { WidgetModel } from "@paperbits/common/widgets";
import { LocalStyles } from "@paperbits/common/styles";

export class TabPanelModel {
    public tabPanelItems: TabPanelItemModel[];
    public styles: LocalStyles;

    constructor() {
        this.styles = {};
        this.tabPanelItems = [];
    }
}

export class TabPanelItemModel {
    public widgets: WidgetModel[];
    public styles: LocalStyles;
    public label: string;

    constructor(label: string = "Tab") {
        this.styles = {};
        this.widgets = [];
        this.label = label;
    }
}