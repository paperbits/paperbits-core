import * as ko from "knockout";
import template from "./section.html";
import { BackgroundModel } from "@paperbits/common/widgets/background/backgroundModel";
import { Component } from "../../ko/decorators/component.decorator";
import { WidgetViewModel } from "../../ko/widgetViewModel";

@Component({
    selector: "layout-section",
    template: template
})
export class SectionViewModel implements WidgetViewModel {
    public widgets: KnockoutObservableArray<WidgetViewModel>;
    public container: KnockoutObservable<string>;
    public snapTo: KnockoutObservable<string>;
    public background: KnockoutObservable<BackgroundModel>;
    public height: KnockoutObservable<string>;

    constructor() {
        this.widgets = ko.observableArray<WidgetViewModel>();
        this.container = ko.observable<string>();
        this.snapTo = ko.observable<string>();
        this.background = ko.observable<BackgroundModel>();
        this.height = ko.observable<string>();
    }
}