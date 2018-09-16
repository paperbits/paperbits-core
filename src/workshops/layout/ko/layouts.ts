import * as ko from "knockout";
import template from "./layouts.html";
import { Contract } from "@paperbits/common/contract";
import { IRouteHandler } from "@paperbits/common/routing";
import { IViewManager } from "@paperbits/common/ui";
import { IFileService } from "@paperbits/common/files";
import { ILayoutService } from "@paperbits/common/layouts";
import { Keys } from "@paperbits/common/keyboard";
import { LayoutItem } from "./layoutItem";
import { Component } from "../../../ko/component";

@Component({
    selector: "layouts",
    template: template,
    injectable: "layoutsWorkshop"
})
export class LayoutsWorkshop {
    private readonly layoutService: ILayoutService;
    private readonly fileService: IFileService;
    private readonly routeHandler: IRouteHandler;
    private readonly viewManager: IViewManager;
    private template: Contract;

    public readonly searchPattern: KnockoutObservable<string>;
    public readonly layouts: KnockoutObservableArray<LayoutItem>;
    public readonly working: KnockoutObservable<boolean>;

    public selectedLayout: KnockoutObservable<LayoutItem>;

    constructor(layoutService: ILayoutService, fileService: IFileService, routeHandler: IRouteHandler, viewManager: IViewManager) {
        // initialization...
        this.layoutService = layoutService;
        this.fileService = fileService;
        this.routeHandler = routeHandler;
        this.viewManager = viewManager;

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

        this.init();
        this.searchLayouts();
    }

    public async init(): Promise<void> {
        this.template = {
            "object": "block",
            "nodes": [{
                "object": "block",
                "type": "page"
            }],
            "type": "layout"
        }
    }

    public async searchLayouts(searchPattern: string = ""): Promise<void> {
        this.working(true);

        const layouts = await this.layoutService.search(searchPattern);
        const layoutItems = layouts.map(layout => new LayoutItem(layout));

        this.layouts(layoutItems);
        this.working(false);
    }

    public selectLayout(layoutItem: LayoutItem): void {
        this.selectedLayout(layoutItem);
        
        this.viewManager.openViewAsWorkshop("Layout", "layout-details-workshop", {
            layoutItem: layoutItem,
            onDeleteCallback: () => {
                this.searchLayouts();
            }
        });
    }

    public async addLayout(): Promise<void> {
        this.working(true);
        const layout = await this.layoutService.createLayout("New Layout", "", LayoutItem.newLayoutUri);
        const content = await this.fileService.createFile(this.template);

        layout.contentKey = content.key;

        await this.layoutService.updateLayout(layout);

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