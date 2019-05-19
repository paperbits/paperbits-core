import { Bag } from "@paperbits/common";
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { StyleModel } from "@paperbits/common/styles";

export class ButtonModel {
    public label: string;
    public hyperlink: HyperlinkModel;
    public styles: Bag<string>;
    public styleModel: StyleModel;

    constructor() {
        this.label = "Button";
        this.styles = { appearance: "components/button/default" };
    }
}
