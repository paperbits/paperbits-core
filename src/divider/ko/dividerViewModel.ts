import * as ko from "knockout";
import template from "./divider.html";
import { Component } from "@paperbits/common/ko/decorators";
import { StyleModel } from "@paperbits/common/styles";


@Component({
    selector: "divider",
    template: template
})
export class Divider {
    public readonly styles: ko.Observable<StyleModel>;

    constructor() {
        this.styles = ko.observable<StyleModel>();
    }
}