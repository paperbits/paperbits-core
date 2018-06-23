import { IHtmlEditor } from "@paperbits/common/editing";

export class TextblockModel {
    public type: string = "text";
    public state: Object;
    public htmlEditor: IHtmlEditor;

    constructor(state: Object) {
        this.state = state;
    }

    private onChange(): void {
        this.state = this.htmlEditor.getState();
    }
}