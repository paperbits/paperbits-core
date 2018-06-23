import * as ko from "knockout";
import template from "./textblock.html";
import { IHtmlEditor } from "@paperbits/common/editing/IHtmlEditor";
import { Component } from "../../ko/component";

@Component({
    selector: "paperbits-text",
    template: template
})
export class TextblockViewModel {
    public readonly htmlEditor: IHtmlEditor;
    public readonly state: KnockoutObservable<Object>;

    public readonly: KnockoutObservable<boolean>;

    constructor(htmlEditor: IHtmlEditor) {
        this.htmlEditor = htmlEditor;
        this.state = ko.observable();
        this.readonly = ko.observable(false);
    }
}

