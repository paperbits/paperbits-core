import * as ko from "knockout";
import template from "./row.html";
import { Component } from "@paperbits/common/ko/decorators";
import { WidgetViewModel } from "../../ko/widgetViewModel";

@Component({
    selector: "layout-row",
    template: template
})
export class RowViewModel implements WidgetViewModel {
    public widgets: ko.ObservableArray<WidgetViewModel>;
    public css: ko.Computed<string>;
    public alignSm: ko.Observable<string>;
    public alignMd: ko.Observable<string>;
    public alignLg: ko.Observable<string>;
    public justifySm: ko.Observable<string>;
    public justifyMd: ko.Observable<string>;
    public justifyLg: ko.Observable<string>;

    constructor() {
        this.widgets = ko.observableArray<WidgetViewModel>();
        this.alignSm = ko.observable<string>();
        this.alignMd = ko.observable<string>();
        this.alignLg = ko.observable<string>();
        this.justifySm = ko.observable<string>();
        this.justifyMd = ko.observable<string>();
        this.justifyLg = ko.observable<string>();

        this.css = ko.computed(() => {
            let css = "";

            if (this.alignSm()) {
                css += " " + this.alignSm() + "-sm";
            }
            if (this.alignMd()) {
                css += " " + this.alignMd() + "-md";
            }
            if (this.alignLg()) {
                css += " " + this.alignLg() + "-lg";
            }
            if (this.justifySm()) {
                css += " " + this.justifySm() + "-sm";
            }
            if (this.justifyMd()) {
                css += " " + this.justifyMd() + "-md";
            }
            if (this.justifyLg()) {
                css += " " + this.justifyLg() + "-lg";
            }

            return css;
        });
    }
}
