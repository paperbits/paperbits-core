import * as ko from "knockout";
import template from "./layout.html";
import { Component } from "@paperbits/common/ko/decorators";
import { WidgetViewModel } from "../../ko";

@Component({
    selector: "page-layout",
    template: template
})
export class LayoutViewModel implements WidgetViewModel {
    public widgets: ko.ObservableArray<Object>;

    constructor() {
        this.widgets = ko.observableArray<Object>();
    }
}