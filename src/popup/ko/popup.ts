import * as ko from "knockout";
import template from "./popup.html";
import { Component } from "@paperbits/common/ko/decorators";
import { StyleModel } from "@paperbits/common/styles";

@Component({
    selector: "popup",
    template: template
})
export class PopupViewModel {
    public identifier: ko.Observable<string>;
    public widgets: ko.ObservableArray<Object>;
    public styles: ko.Observable<StyleModel>;
    public backdrop: ko.Observable<boolean>;

    constructor() {
        this.identifier = ko.observable();
        this.widgets = ko.observableArray<Object>();
        this.styles = ko.observable<StyleModel>();
        this.backdrop = ko.observable();
    }
}
