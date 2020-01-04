import * as ko from "knockout";
import template from "./layoutSelector.html";
import { IResourceSelector } from "@paperbits/common/ui";
import { ILayoutService, LayoutContract } from "@paperbits/common/layouts";
import { LayoutItem } from "./layoutItem";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";


@Component({
    selector: "layout-selector",
    template: template
})
export class LayoutSelector implements IResourceSelector<LayoutContract> {
    public readonly searchPattern: ko.Observable<string>;
    public readonly layouts: ko.ObservableArray<LayoutItem>;
    public readonly working: ko.Observable<boolean>;

    @Param()
    public selectedLayout: ko.Observable<LayoutItem>;

    @Event()
    public onSelect: (layout: LayoutContract) => void;

    constructor(private readonly layoutService: ILayoutService) {
        this.layouts = ko.observableArray();
        this.selectedLayout = ko.observable();
        this.searchPattern = ko.observable();
        this.working = ko.observable();
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