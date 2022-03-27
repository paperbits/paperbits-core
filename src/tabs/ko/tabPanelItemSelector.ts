import * as ko from "knockout";
import template from "./tabPanelItemSelector.html";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { TabPanelItemModel } from "../tabPanelModel";


@Component({
    selector: "tabpanel-item-selector",
    template: template
})
export class TabPanelItemSelector {
    public readonly tabPanelItems: ko.Observable<TabPanelItemModel[]>;
    public readonly activeTabPanelItem: ko.Observable<TabPanelItemModel>;

    constructor() {
        this.tabPanelItems = ko.observable([]);
        this.activeTabPanelItem = ko.observable();
    }

    @Param()
    public activeTabPanelItemModel: TabPanelItemModel = null;

    @Param()
    public tabPanelItemModels: TabPanelItemModel[];

    @Event()
    public onSelect: (item: TabPanelItemModel) => void;

    @Event()
    public onCreate: () => void;

    @OnMounted()
    public initialize(): void {
        this.tabPanelItems(this.tabPanelItemModels);
        this.activeTabPanelItem(this.activeTabPanelItemModel);
    }

    public selectTabPanelItem(item: TabPanelItemModel): void {
        if (this.onSelect) {
            this.onSelect(item);
        }
    }

    public addTabPanelItem(): void {
        if (this.onCreate) {
            this.onCreate();
        }
    }
}