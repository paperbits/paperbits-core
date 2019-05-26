import { BackgroundModel } from "@paperbits/common/widgets/background";
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { Bag } from "@paperbits/common/bag";

export class PictureModel {
    public background: BackgroundModel;
    public caption: string;
    public action: string;
    public layout: string;
    public animation: string;
    public hyperlink: HyperlinkModel;
    public width: number;
    public height: number;
    public styles: Bag<string>;

    constructor() {
        this.layout = "noframe";
    }
}