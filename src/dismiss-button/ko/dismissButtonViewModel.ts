import * as ko from "knockout";
import template from "./dismissButton.html";
import { Component } from "@paperbits/common/ko/decorators";
import { StyleModel } from "@paperbits/common/styles";


@Component({
    selector: "dismiss-button",
    template: template
})
export class DismissButton {
    public readonly label: ko.Observable<string>;
    public readonly styles: ko.Observable<StyleModel>;
    public readonly icon: ko.Observable<string>;

    constructor() {
        this.label = ko.observable<string>("DismissButton");
        this.styles = ko.observable<StyleModel>();
        this.icon = ko.observable<string>();
    }
}