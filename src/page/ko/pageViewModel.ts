import * as ko from "knockout";
import template from "./page.html";
import { Component } from "@paperbits/common/ko/decorators";
import { WidgetViewModel } from "../../ko/widgetViewModel";

@Component({
    selector: "paperbits-page",
    template: template
})
export class PageViewModel implements WidgetViewModel {
    public title: ko.Observable<string>;
    public description: ko.Observable<string>;
    public keywords: ko.Observable<string>;
    public widgets: ko.ObservableArray<Object>;

    constructor() {
        this.title = ko.observable<string>();
        this.description = ko.observable<string>();
        this.keywords = ko.observable<string>();
        this.widgets = ko.observableArray<Object>();
    }
}
