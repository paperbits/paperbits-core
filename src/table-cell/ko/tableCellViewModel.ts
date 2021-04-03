import * as ko from "knockout";
import template from "./tableCell.html";
import { Component } from "@paperbits/common/ko/decorators";
import { StyleModel } from "@paperbits/common/styles";

@Component({
    selector: "table-cell",
    template: template
})
export class TableCellViewModel {
    public widgets: ko.ObservableArray<Object>;
    public role: ko.Observable<string>;
    public styles: ko.Observable<StyleModel>;

    constructor() {
        this.widgets = ko.observableArray<Object>();
        this.styles = ko.observable<any>();
        this.role = ko.observable<string>();
    }
}