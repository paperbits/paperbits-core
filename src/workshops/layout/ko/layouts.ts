import * as ko from "knockout";
import template from "./layouts.html";
import { ViewManager, View } from "@paperbits/common/ui";
import { ILayoutService } from "@paperbits/common/layouts";
import { LayoutItem } from "./layoutItem";
import { Component, OnMounted } from "@paperbits/common/ko/decorators";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";

@Component({
    selector: "layouts",
    template: template
})
export class LayoutsWorkshop {
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

        const layouts = await this.layoutService.search(searchPattern);
        const layoutItems = layouts.map(layout => new LayoutItem(layout));

        this.layouts(layoutItems);
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
}