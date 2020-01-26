import { WidgetModel } from "@paperbits/common/widgets";
import { LocalStyles } from "@paperbits/common/styles";

export class GridCellModel implements WidgetModel {
    public role: string;
    public styles?: LocalStyles;
    public widgets?: WidgetModel[];

    constructor() {
        this.role = "article";
        this.widgets = [];
    }
}