import * as ko from "knockout";
import template from "./table.html";
import { Component } from "@paperbits/common/ko/decorators";
import { WidgetViewModel } from "../../ko/widgetViewModel";
import { StyleModel } from "@paperbits/common/styles";

@Component({
    selector: "table-layout-section",
    template: template
})
export class TableViewModel implements WidgetViewModel {
    public widgets: ko.ObservableArray<WidgetViewModel>;
    public container: ko.Observable<string>;
    public styles: ko.Observable<StyleModel>;

    constructor() {
        this.widgets = ko.observableArray<WidgetViewModel>();
        this.container = ko.observable<string>();
        this.styles = ko.observable<StyleModel>();
    }
}