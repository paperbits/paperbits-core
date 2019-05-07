import * as ko from "knockout";
import template from "./textblock.html";
import { IHtmlEditor } from "@paperbits/common/editing/IHtmlEditor";
import { Component } from "@paperbits/common/ko/decorators";
import { BlockModel } from "@paperbits/common/text/models";

@Component({
    selector: "paperbits-text",
    template: template
})
export class TextblockViewModel {
    public readonly htmlEditor: IHtmlEditor;
    public readonly state: ko.Observable<BlockModel[]>;
    public readonly readonly: ko.Observable<boolean>;

    constructor(htmlEditor: IHtmlEditor) {
        this.htmlEditor = htmlEditor;
        this.state = ko.observable();
        this.readonly = ko.observable(false);
    }
}

