import * as ko from "knockout";
import template from "./section.html";
import { Component } from "@paperbits/common/ko/decorators";
import { WidgetViewModel } from "../../ko/widgetViewModel";
import { StyleModel } from "@paperbits/common/styles";
import { SecurityModel } from "@paperbits/common/security";

@Component({
    selector: "layout-section",
    template: template
})
export class SectionViewModel implements WidgetViewModel {
    public widgets: ko.ObservableArray<WidgetViewModel>;
    public styles: ko.Observable<StyleModel>;
    public readonly security: ko.Observable<SecurityModel>;

    constructor() {
        this.widgets = ko.observableArray<WidgetViewModel>();
        this.styles = ko.observable<StyleModel>();
        this.security = ko.observableArray<SecurityModel>();
    }
}