import * as ko from "knockout";
import template from "./layouts.html";
import { Router } from "@paperbits/common/routing";
import { ViewManager, View } from "@paperbits/common/ui";
import { ILayoutService } from "@paperbits/common/layouts";
import { Keys } from "@paperbits/common/keyboard";
import { LayoutItem } from "./layoutItem";
import { Component, OnMounted } from "@paperbits/common/ko/decorators";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";

@Component({
    selector: "layouts",
    template: template,
    injectable: "layoutsWorkshop"
})
export class LayoutsWorkshop {
    public readonly searchPattern: ko.Observable<string>;
    public readonly layouts: ko.ObservableArray<LayoutItem>;
    public readonly working: ko.Observable<boolean>;
    public readonly selectedLayout: ko.Observable<LayoutItem>;

    constructor(
        private readonly layoutService: ILayoutService,
        private readonly router: Router,
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
        this.viewManager.setHost({ name: "content-host" });

        const view: View = {
            heading: "Layout",
            component: {
                name: "layout-details-workshop",
                params: {
                    layoutItem: layoutItem,
                    onDeleteCallback: () => {
                        this.searchLayouts();
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

    public async deleteSelectedLayout(): Promise<void> {
        // TODO: Show confirmation dialog according to mockup
        this.viewManager.closeWorkshop("layout-details-workshop");

        await this.layoutService.deleteLayout(this.selectedLayout().toLayout());
        await this.searchLayouts();

        this.router.navigateTo("/");
    }

    public onKeyDown(item: LayoutItem, event: KeyboardEvent): boolean {
        switch (event.keyCode) {
            case Keys.Delete:
                this.deleteSelectedLayout();
                break;

            case Keys.Enter:
            case Keys.Space:
                this.selectLayout(item);
        }

        return true;
    }
}