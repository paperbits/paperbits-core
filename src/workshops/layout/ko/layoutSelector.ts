import * as ko from "knockout";
import template from "./layoutSelector.html";
import { IResourceSelector } from "@paperbits/common/ui";
import { ILayoutService, LayoutContract } from "@paperbits/common/layouts";
import { LayoutItem } from "./layoutItem";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";


@Component({
    selector: "layout-selector",
    template: template,
    injectable: "layoutSelector"
})
export class LayoutSelector implements IResourceSelector<LayoutContract> {
    public readonly searchPattern: KnockoutObservable<string>;
    public readonly layouts: KnockoutObservableArray<LayoutItem>;
    public readonly working: KnockoutObservable<boolean>;

    @Param()
    public selectedLayout: KnockoutObservable<LayoutItem>;

    @Event()
    public onSelect: (layout: LayoutContract) => void;

    constructor(private readonly layoutService: ILayoutService) {
        this.onMounted = this.onMounted.bind(this);
        this.selectLayout = this.selectLayout.bind(this);

        this.layouts = ko.observableArray<LayoutItem>();
        this.selectedLayout = ko.observable<LayoutItem>();
        this.searchPattern = ko.observable<string>();
        this.searchPattern.subscribe(this.searchLayouts);
        this.working = ko.observable(true);

        // setting up...
        this.layouts = ko.observableArray<LayoutItem>();
        this.selectedLayout = ko.observable<LayoutItem>();
        this.searchPattern = ko.observable<string>();
        this.searchPattern.subscribe(this.searchLayouts);
        this.working = ko.observable(true);
    }

    @OnMounted()
    public async onMounted(): Promise<void> {
        this.searchLayouts();
    }

    public async searchLayouts(searchPattern: string = ""): Promise<void> {
        this.working(true);

        const layouts = await this.layoutService.search(searchPattern);
        const layoutItems = layouts.map(layout => new LayoutItem(layout));
        this.layouts(layoutItems);
        this.working(false);
    }

    public async selectLayout(layout: LayoutItem): Promise<void> {
        this.selectedLayout(layout);

        if (this.onSelect) {
            this.onSelect(layout.toLayout());
        }
    }
}