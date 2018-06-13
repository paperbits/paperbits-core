import * as ko from "knockout";
import template from "./button.html";
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { Component } from "@paperbits/knockout/decorators";

@Component({
    selector: "paperbits-button",
    template: template
})
export class ButtonViewModel {
    public label: KnockoutObservable<string>;
    public css: KnockoutObservable<Object>;
    public hyperlink: KnockoutObservable<HyperlinkModel>;

    constructor() {
        this.label = ko.observable<string>("Button");
        this.css = ko.observable<Object>();
        this.hyperlink = ko.observable<HyperlinkModel>();
    }
}