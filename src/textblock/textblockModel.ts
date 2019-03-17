import { IHtmlEditor } from "@paperbits/common/editing";
import { BlockModel } from "../text/models";

export class TextblockModel {
    public type: string = "text-block";
    public state: object;
    public htmlEditor: IHtmlEditor;

    constructor(state: any) {
        this.state = state;
    }
}