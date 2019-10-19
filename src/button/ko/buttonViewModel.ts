import * as ko from "knockout";
import template from "./button.html";
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { Component } from "@paperbits/common/ko/decorators";
import { StyleModel } from "@paperbits/common/styles";


@Component({
    selector: "paperbits-button",
    template: template
})
export class Button {
    public readonly label: ko.Observable<string>;
    public readonly styles: ko.Observable<StyleModel>;
    public readonly hyperlink: ko.Observable<HyperlinkModel>;

    constructor() {
        this.label = ko.observable<string>("Button");
        this.styles = ko.observable<StyleModel>();
        this.hyperlink = ko.observable<HyperlinkModel>();
    }
}