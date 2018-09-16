import * as ko from "knockout";
import template from "./layout.html";
import { Component } from "@paperbits/core/ko/component";

@Component({
    selector: "page-layout",
    template: template
})
export class LayoutViewModel {
    public title: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;
    public uriTemplate: KnockoutObservable<string>;
    public widgets: KnockoutObservableArray<Object>;

    constructor() {
        this.widgets = ko.observableArray<Object>();
        this.title = ko.observable<string>();
        this.description = ko.observable<string>();
        this.uriTemplate = ko.observable<string>();
    }
}