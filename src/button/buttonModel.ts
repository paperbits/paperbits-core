import { HyperlinkModel } from "@paperbits/common/permalinks";

export class ButtonModel {
    public label: string;
    public style: string;
    public size: string;
    public hyperlink: HyperlinkModel;

    constructor() {
        this.label = "Button";
        this.style = "default";
        this.size = "default";
    }
}
