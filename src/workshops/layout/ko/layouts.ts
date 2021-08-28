import * as ko from "knockout";
import template from "./layouts.html";
import { ViewManager, View } from "@paperbits/common/ui";
import { ILayoutService, LayoutContract } from "@paperbits/common/layouts";
import { LayoutItem } from "./layoutItem";
import { Component, OnMounted } from "@paperbits/common/ko/decorators";
import { Query, Operator, Page } from "@paperbits/common/persistence";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";


@Component({
    selector: "layouts",
    template: template
})
export class LayoutsWorkshop {
    private currentPage: Page<LayoutContract>;
    public readonly searchPattern: ko.Observable<string>;
    public readonly layouts: ko.ObservableArray<LayoutItem>;
    public readonly working: ko.Observable<boolean>;
    public readonly selectedLayout: ko.Observable<LayoutItem>;

    constructor(
        private readonly layoutService: ILayoutService,
        private readonly viewManager: ViewManager
    ) {
        this.layouts = ko.observableArray();
        this.selectedLayout = ko.observable();
        this.searchPattern = ko.observable();
        this.working = ko.observable();
    }

    @OnMounted()
    public async initialize(): Promise<void> {
        await this.searchLayouts();

        this.searchPattern
            .extend(ChangeRateLimit)
            .subscribe(this.searchLayouts);
    }

    public async searchLayouts(searchPattern: string = ""): Promise<void> {
        this.working(true);

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

        this.working(false);
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

    public selectLayout(layoutItem: LayoutItem): void {
        this.selectedLayout(layoutItem);

        const view: View = {
            heading: "Layout",
            component: {
                name: "layout-details-workshop",
                params: {
                    layoutItem: layoutItem,
                    onDeleteCallback: () => {
                        this.searchLayouts();
                    },
                    onCopyCallback: async (item: LayoutItem) => {
                        await this.searchLayouts();
                        this.selectLayout(item);
                    }
                }
            }
        };

        this.viewManager.openViewAsWorkshop(view);
    }

    public async addLayout(): Promise<void> {
        this.working(true);

        const layoutUrlTemplate = "/new-layout";
        const layout = await this.layoutService.createLayout("New Layout", "", layoutUrlTemplate);
        const layoutItem = new LayoutItem(layout);

        this.layouts.push(layoutItem);
        this.selectLayout(layoutItem);

        this.working(false);
    }

    public isSelected(page: LayoutItem): boolean {
        const selectedPage = this.selectedLayout();
        return selectedPage?.key === page.key;
    }
}