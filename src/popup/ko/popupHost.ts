import * as ko from "knockout";
import template from "./popupHost.html";
import { Component } from "@paperbits/common/ko/decorators";


@Component({
    selector: "popup-host",
    template: template
})
export class PopupHost {
    public widgets: ko.ObservableArray<Object>;

    constructor() {
        this.widgets = ko.observableArray<Object>();
    }
}
