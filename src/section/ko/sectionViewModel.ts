import * as ko from "knockout";
import template from "./section.html";
import { Component } from "@paperbits/common/ko/decorators";
import { WidgetViewModel } from "../../ko/widgetViewModel";

@Component({
    selector: "layout-section",
    template: template
})
export class SectionViewModel implements WidgetViewModel {
    public widgets: ko.ObservableArray<WidgetViewModel>;
    public styles: ko.Observable<Object>;

    constructor() {
        this.widgets = ko.observableArray<WidgetViewModel>();
        this.styles = ko.observable<Object>();
    }
}