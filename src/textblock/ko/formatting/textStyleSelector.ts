import * as ko from "knockout";
import * as _ from "lodash";
import template from "./textStyleSelector.html";
import { Component, Param, Event } from "@paperbits/common/ko/decorators";

@Component({
    selector: "text-style-selector",
    template: template
})
export class TextStyleSelector {
    constructor() {
        this.styles = ko.observableArray();
    }

    @Param()
    public styles: ko.ObservableArray;

    @Event()
    public onSelect: (style: any) => void;

    public setTextStyle(style: any): void {
        if (this.onSelect) {
            this.onSelect(style);
        }
    }
}