import * as ko from "knockout";
import template from "./layouts.html";
import { Contract } from "@paperbits/common/contract";
import { IRouteHandler } from "@paperbits/common/routing";
import { IViewManager } from "@paperbits/common/ui";
import { ILayoutService } from "@paperbits/common/layouts";
import { Keys } from "@paperbits/common/keyboard";
import { LayoutItem } from "./layoutItem";
import { Component, OnMounted } from "@paperbits/common/ko/decorators";

@Component({
    selector: "layouts",
    template: template,
    injectable: "layoutsWorkshop"
})
export class LayoutsWorkshop {
    private template: Contract;

    public readonly searchPattern: ko.Observable<string>;
    public readonly layouts: ko.ObservableArray<LayoutItem>;
    public readonly working: ko.Observable<boolean>;
    public readonly selectedLayout: ko.Observable<LayoutItem>;

    constructor(
        private readonly layoutService: ILayoutService,
        private readonly routeHandler: IRouteHandler,
        private readonly viewManager: IViewManager
    ) {
        // rebinding...
        this.searchLayouts = this.searchLayouts.bind(this);
        this.addLayout = this.addLayout.bind(this);
        this.selectLayout = this.selectLayout.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);

        // setting up...
        this.layouts = ko.observableArray<LayoutItem>();
        this.selectedLayout = ko.observable<LayoutItem>();
        this.searchPattern = ko.observable<string>();
        this.searchPattern.subscribe(this.searchLayouts);
        this.working = ko.observable(true);
    }

    @OnMounted()
    public async searchLayouts(searchPattern: string = ""): Promise<void> {
        this.working(true);

        const layouts = await this.layoutService.search(searchPattern);
        const layoutItems = layouts.map(layout => new LayoutItem(layout));

        this.layouts(layoutItems);
        this.working(false);
    }

    public selectLayout(layoutItem: LayoutItem): void {
        this.selectedLayout(layoutItem);
        this.viewManager.setHost({ name: "page-host" });
        this.viewManager.openViewAsWorkshop("Layout", "layout-details-workshop", {
            layoutItem: layoutItem,
            onDeleteCallback: () => {
                this.searchLayouts();
            }
        });
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

        this.routeHandler.navigateTo("/");
    }

    public onKeyDown(item: LayoutItem, event: KeyboardEvent): void {
        if (event.keyCode === Keys.Delete) {
            this.deleteSelectedLayout();
        }
    }
}