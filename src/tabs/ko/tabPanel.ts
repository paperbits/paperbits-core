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
    public tabPanelItems: ko.ObservableArray<TabPanelItemViewModel>;
    public tabLinks: ko.Computed<string[]>;
    public activeItemIndex: ko.Observable<number>;

    constructor() {
        this.tabPanelItems = ko.observableArray<TabPanelItemViewModel>();
        this.styles = ko.observable<StyleModel>();
        this.activeItemIndex = ko.observable(0);
        this.tabLinks = ko.computed(() => this.tabPanelItems().map(x => x.label()));
    }
}