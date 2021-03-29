import { WidgetModel } from "@paperbits/common/widgets";
import { LocalStyles } from "@paperbits/common/styles";

export class PopupModel implements WidgetModel {
    public key: string;
    public widgets: WidgetModel[];
    public styles: LocalStyles;
    public backdrop: boolean;

    constructor() {
        this.widgets = [];
        this.styles = {};
    }
}