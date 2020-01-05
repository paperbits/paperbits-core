import * as ko from "knockout";
import template from "./page.html";
import { Component } from "@paperbits/common/ko/decorators";
import { WidgetViewModel } from "../../ko";

@Component({
    selector: "paperbits-page",
    template: template
})
export class PageViewModel implements WidgetViewModel {
    public widgets: ko.ObservableArray<Object>;

    constructor() {
        this.widgets = ko.observableArray<Object>();
    }
}
