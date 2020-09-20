import * as ko from "knockout";
import template from "./layoutSelector.html";
import { IResourceSelector } from "@paperbits/common/ui";
import { ILayoutService, LayoutContract } from "@paperbits/common/layouts";
import { Query, Operator, Page } from "@paperbits/common/persistence";
import { LayoutItem } from "./layoutItem";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";


@Component({
    selector: "layout-selector",
    template: template
})
export class LayoutSelector implements IResourceSelector<LayoutContract> {
    private currentPage: Page<LayoutContract>;
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
        this.layouts([]);

        const query = Query
            .from<LayoutContract>()
            .orderBy(`title`);

        if (searchPattern) {
            query.where(`title`, Operator.contains, searchPattern);
        }

        const pageOfResults = await this.layoutService.search(query);
        this.currentPage = pageOfResults;

        const pageItems = pageOfResults.value.map(page => new LayoutItem(page));
        this.layouts.push(...pageItems);
    }

    public async loadNextPage(): Promise<void> {
        if (!this.currentPage?.takeNext || this.working()) {
            this.loadNextPage = null;
            return;
        }

        this.working(true);

        this.currentPage = await this.currentPage.takeNext();

        const layoutItems = this.currentPage.value.map(page => new LayoutItem(page));
        this.layouts.push(...layoutItems);

        this.working(false);
    }

    public async selectLayout(layout: LayoutItem): Promise<void> {
        this.selectedLayout(layout);

        if (this.onSelect) {
            this.onSelect(layout.toContract());
        }
    }
}