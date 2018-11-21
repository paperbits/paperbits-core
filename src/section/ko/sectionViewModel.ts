import * as ko from "knockout";
import template from "./section.html";
import { Component } from "@paperbits/common/ko/decorators";
import { WidgetViewModel } from "../../ko/widgetViewModel";

@Component({
    selector: "layout-section",
    template: template
})
export class SectionViewModel implements WidgetViewModel {
    public widgets: KnockoutObservableArray<WidgetViewModel>;
    public container: KnockoutObservable<string>;
    public snapTo: KnockoutObservable<string>;
    public height: KnockoutObservable<string>;
    public styles: KnockoutObservable<Object>;

    constructor() {
        this.widgets = ko.observableArray<WidgetViewModel>();
        this.container = ko.observable<string>();
        this.snapTo = ko.observable<string>();
        this.height = ko.observable<string>();
        this.styles = ko.observable<Object>();
    }
}