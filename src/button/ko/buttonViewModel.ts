import * as ko from "knockout";
import template from "./button.html";
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { Component } from "@paperbits/common/ko/decorators";

@Component({
    selector: "paperbits-button",
    template: template
})
export class ButtonViewModel {
    public label: KnockoutObservable<string>;
    public styles: KnockoutObservable<Object>;
    public hyperlink: KnockoutObservable<HyperlinkModel>;

    constructor() {
        this.label = ko.observable<string>("Button");
        this.styles = ko.observable<Object>();
        this.hyperlink = ko.observable<HyperlinkModel>();
    }
}