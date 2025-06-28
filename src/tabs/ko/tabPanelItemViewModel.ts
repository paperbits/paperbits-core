import * as ko from "knockout";
import template from "./tabPanelItem.html";
import { Component } from "@paperbits/common/ko/decorators";
import { StyleModel } from "@paperbits/common/styles";


@Component({
    selector: "tabPanelItem",
    template: template
})
export class TabPanelItemViewModel {
    public readonly styles: ko.Observable<StyleModel>;
    public readonly widgets: ko.ObservableArray<any>;
    public readonly label: ko.Observable<string>;

    constructor() {
        this.widgets = ko.observableArray();
        this.styles = ko.observable<StyleModel>();
        this.label = ko.observable<string>("Tab");
    }
}
