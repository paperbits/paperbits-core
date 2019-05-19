import * as ko from "knockout";
import template from "./grid.html";
import { Component } from "@paperbits/common/ko/decorators";
import { WidgetViewModel } from "../../ko/widgetViewModel";

@Component({
    selector: "grid-layout-section",
    template: template,
    injectable: "gridViewModel"
})
export class GridViewModel implements WidgetViewModel {
    public cells: ko.ObservableArray<any>;
    public widgets: ko.ObservableArray<WidgetViewModel>;
    public container: ko.Observable<string>;
    public styles: ko.Observable<Object>;

    constructor() {
        this.widgets = ko.observableArray<WidgetViewModel>();
        this.container = ko.observable<string>();
        this.styles = ko.observable<Object>();
        this.cells = ko.observableArray([]);
    }
}