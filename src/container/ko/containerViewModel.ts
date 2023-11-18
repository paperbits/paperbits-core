import * as ko from "knockout";
import template from "./container.html";
import { Component } from "@paperbits/common/ko/decorators";
import { StyleModel } from "@paperbits/common/styles";


@Component({
    selector: "container",
    template: template
})
export class ContainerViewModel {
    public widgets: ko.ObservableArray<Object>;
    public styles: ko.Observable<StyleModel>;

    constructor() {
        this.widgets = ko.observableArray<Object>();
        this.styles = ko.observable<StyleModel>();
    }
}
