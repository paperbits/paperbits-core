import * as ko from "knockout";
import template from "./button.html";
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { Component } from "@paperbits/common/ko/decorators";
import { StyleModel } from "@paperbits/common/styles";
import { SecurityModel } from "@paperbits/common/security";


@Component({
    selector: "paperbits-button",
    template: template
})
export class Button {
    public readonly label: ko.Observable<string>;
    public readonly styles: ko.Observable<StyleModel>;
    public readonly hyperlink: ko.Observable<HyperlinkModel>;
    public readonly icon: ko.Observable<string>;
    public readonly roles: ko.ObservableArray<string>;
    public readonly security: ko.ObservableArray<SecurityModel>;

    constructor() {
        this.label = ko.observable<string>("Button");
        this.styles = ko.observable<StyleModel>();
        this.hyperlink = ko.observable<HyperlinkModel>();
        this.icon = ko.observable<string>();
        this.security = ko.observableArray<SecurityModel>();
    }
}