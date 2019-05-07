import { IHtmlEditor } from "@paperbits/common/editing";
import { BlockModel } from "@paperbits/common/text/models";

export class TextblockModel {
    public type: string = "text-block";
    public state: BlockModel[];
    public htmlEditor: IHtmlEditor;

    constructor(state: any) {
        this.state = state;
    }
}