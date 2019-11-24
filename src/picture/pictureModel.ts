import { HyperlinkModel } from "@paperbits/common/permalinks";
import { LocalStyles } from "@paperbits/common/styles";

export class PictureModel {
    public sourceKey: string;
    public caption: string;
    public hyperlink: HyperlinkModel;
    public width: number;
    public height: number;
    public styles: LocalStyles;
}