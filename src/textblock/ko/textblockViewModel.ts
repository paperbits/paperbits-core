import * as ko from "knockout";
import template from "./textblock.html";
import { IHtmlEditor } from "@paperbits/common/editing/IHtmlEditor";
import { Component } from "@paperbits/common/ko/decorators";

@Component({
    selector: "paperbits-text",
    template: template
})
export class TextblockViewModel {
    public readonly htmlEditor: IHtmlEditor;
    public readonly state: ko.Observable<Object>;

    public readonly: ko.Observable<boolean>;

    constructor(htmlEditor: IHtmlEditor) {
        this.htmlEditor = htmlEditor;
        this.state = ko.observable();
        this.readonly = ko.observable(false);
    }
}

