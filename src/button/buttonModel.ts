import { HyperlinkModel } from "@paperbits/common/permalinks";
import { LocalStyles } from "@paperbits/common/styles";

export class ButtonModel {
    public label: string;
    public hyperlink: HyperlinkModel;
    public styles: LocalStyles;

    constructor() {
        this.label = "Button";
        this.styles = { appearance: "components/button/default" };
    }
}
