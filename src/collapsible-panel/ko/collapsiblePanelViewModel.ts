import * as ko from "knockout";
import template from "./collapsiblePanel.html";
import { Component } from "@paperbits/common/ko/decorators";
import { StyleModel } from "@paperbits/common/styles";

@Component({
    selector: "collapsible-panel",
    template: template
})
export class CollapsiblePanel {
    public widgets: ko.ObservableArray<Object>;
    public styles: ko.Observable<StyleModel>;

    constructor() {
        this.widgets = ko.observableArray<Object>();
        this.styles = ko.observable<any>();
    }
}