import * as ko from "knockout";
import template from "./section.html";
import { BackgroundModel } from "@paperbits/common/widgets/background/backgroundModel";
import { Component } from "../../ko/component";
import { RowViewModel } from "../../row/ko/rowViewModel";
import { WidgetViewModel } from "../../ko/widgetViewModel";

@Component({
    selector: "layout-section",
    template: template
})
export class SectionViewModel implements WidgetViewModel {
    public widgets: KnockoutObservableArray<RowViewModel>;
    public container: KnockoutObservable<string>;
    public snapTo: KnockoutObservable<string>;
    public background: KnockoutObservable<BackgroundModel>;

    constructor() {
        this.widgets = ko.observableArray<RowViewModel>();
        this.container = ko.observable<string>();
        this.snapTo = ko.observable<string>();
        this.background = ko.observable<BackgroundModel>();
    }
}