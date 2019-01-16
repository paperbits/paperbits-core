import * as ko from "knockout";
import template from "./layout.html";
import { Component } from "@paperbits/common/ko/decorators";

@Component({
    selector: "page-layout",
    template: template,
    injectable: "layout"
})
export class LayoutViewModel {
    public title: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;
    public permalinkTemplate: KnockoutObservable<string>;
    public widgets: KnockoutObservableArray<Object>;

    constructor() {
        this.widgets = ko.observableArray<Object>();
        this.title = ko.observable<string>();
        this.description = ko.observable<string>();
        this.permalinkTemplate = ko.observable<string>();
    }
}