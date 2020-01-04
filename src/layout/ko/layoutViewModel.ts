import * as ko from "knockout";
import template from "./layout.html";
import { Component } from "@paperbits/common/ko/decorators";

@Component({
    selector: "page-layout",
    template: template
})
export class LayoutViewModel {
    public title: ko.Observable<string>;
    public description: ko.Observable<string>;
    public permalinkTemplate: ko.Observable<string>;
    public widgets: ko.ObservableArray<Object>;

    constructor() {
        this.widgets = ko.observableArray<Object>();
        this.title = ko.observable<string>();
        this.description = ko.observable<string>();
        this.permalinkTemplate = ko.observable<string>();
    }
}