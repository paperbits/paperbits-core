import { WidgetModel } from "@paperbits/common/widgets";
import { Breakpoints } from "@paperbits/common";
import { LocalStyles } from "@paperbits/common/styles";

export class CardModel implements WidgetModel {
    public widgets: WidgetModel[];
    public alignment: Breakpoints;
    public overflowX: string;
    public overflowY: string;
    public styles: LocalStyles;

    constructor() {
        this.widgets = [];
        this.alignment = {};
        this.styles = { appearance: "components/card/default" };
    }
}