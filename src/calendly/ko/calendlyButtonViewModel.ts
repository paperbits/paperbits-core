import * as ko from "knockout";
import template from "./calendlyButton.html";
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { Component } from "@paperbits/common/ko/decorators";
import { StyleModel } from "@paperbits/common/styles";


@Component({
    selector: "calendly-button",
    template: template
})
export class CalendlyButton {
    public readonly label: ko.Observable<string>;
    public readonly styles: ko.Observable<StyleModel>;
    public readonly hyperlink: ko.Observable<HyperlinkModel>;
    public readonly roles: ko.ObservableArray<string>;

    constructor() {
        this.label = ko.observable<string>("CalendlyButton");
        this.styles = ko.observable<StyleModel>();
        this.hyperlink = ko.observable<HyperlinkModel>();
        this.roles = ko.observableArray<string>();
    }
}