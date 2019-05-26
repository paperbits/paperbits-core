import { Bag } from "@paperbits/common";
import { HyperlinkModel } from "@paperbits/common/permalinks";

export class ButtonModel {
    public label: string;
    public hyperlink: HyperlinkModel;
    public styles: Bag<string>;

    constructor() {
        this.label = "Button";
        this.styles = { appearance: "components/button/default" };
    }
}
