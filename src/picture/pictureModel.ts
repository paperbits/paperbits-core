import { HyperlinkModel } from "@paperbits/common/permalinks";
import { Bag } from "@paperbits/common/bag";

export class PictureModel {
    public sourceKey: string;
    public caption: string;
    public hyperlink: HyperlinkModel;
    public width: number;
    public height: number;
    public styles: Bag<string>;
}