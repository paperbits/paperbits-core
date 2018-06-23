import * as ko from "knockout";
import template from "./page.html";
import { Component } from "../../ko/component";
import { WidgetViewModel } from "../../ko/widgetViewModel";

@Component({
    selector: "paperbits-page",
    template: template
})
export class PageViewModel implements WidgetViewModel {
    public title: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;
    public keywords: KnockoutObservable<string>;
    public widgets: KnockoutObservableArray<Object>;

    constructor() {
        this.title = ko.observable<string>();
        this.description = ko.observable<string>();
        this.keywords = ko.observable<string>();
        this.widgets = ko.observableArray<Object>();
    }
}
