import * as ko from "knockout";
import template from "./tabPanel.html";
import { Component } from "@paperbits/common/ko/decorators";
import { StyleModel } from "@paperbits/common/styles";
import { TabPanelItemViewModel } from "./tabPanelItemViewModel";

@Component({
    selector: "tabPanel",
    template: template
})
export class TabPanelViewModel {
    public styles: ko.Observable<StyleModel>;
    public tabPanelItems: ko.ObservableArray<any>;
    public tabLinks: ko.Observable<string[]>;
    public activeItemIndex: ko.Observable<number>;

    constructor() {
        this.tabPanelItems = ko.observableArray<any>();
        this.styles = ko.observable<StyleModel>();
        this.activeItemIndex = ko.observable(0);
        this.tabLinks = ko.observable<string[]>([]);
    }
}