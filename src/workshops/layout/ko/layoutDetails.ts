import * as ko from "knockout";
import template from "./layoutDetails.html";
import { IRouteHandler } from "@paperbits/common/routing";
import { IViewManager } from "@paperbits/common/ui";
import { ILayoutService } from "@paperbits/common/layouts/";
import { LayoutItem } from "./layoutItem";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";

@Component({
    selector: "layout-details-workshop",
    template: template,
    injectable: "layoutDetails"
})
export class LayoutDetails {
    @Param()
    public readonly layoutItem: LayoutItem;

    @Event()
    public readonly onDeleteCallback: () => void;

    public isDefaultLayout: ko.Computed<boolean>;
    public canDelete: ko.Computed<boolean>;

    constructor(
        private readonly layoutService: ILayoutService,
        private readonly routeHandler: IRouteHandler,
        private readonly viewManager: IViewManager
    ) {
    }

    @OnMounted()
    public async onMounted(): Promise<void> {
        this.layoutItem.title
            .extend(<any>{ required: true })
            .subscribe(this.updateLayout);

        this.layoutItem.permalinkTemplate
            .extend(<any>{ uniqueLayoutUri: this.layoutItem.key })
            .subscribe(this.updateLayout);

        this.layoutItem.description
            .subscribe(this.updateLayout);

        this.isDefaultLayout = ko.pureComputed(() => {
            return this.layoutItem.permalinkTemplate() === "/";
        });

        this.canDelete = ko.pureComputed(() => {
            return true; // !this.isDefaultLayout();
        });

        const permalinkTemplate = this.layoutItem.permalinkTemplate();
        
        this.routeHandler.navigateTo(permalinkTemplate, this.layoutItem.title(), { routeKind: "layout" });
    }

    private async updateLayout(): Promise<void> {
        if ((<any>this.layoutItem.title).isValid()) {
            await this.layoutService.updateLayout(this.layoutItem.toLayout());
        }
    }

    public async deleteLayout(): Promise<void> {
        // TODO: Show confirmation dialog according to mockup
        await this.layoutService.deleteLayout(this.layoutItem.toLayout());

        this.viewManager.notifySuccess("Layouts", `Page "${this.layoutItem.title()}" was deleted.`);
        this.viewManager.closeWorkshop("layout-details-workshop");

        if (this.onDeleteCallback) {
            this.onDeleteCallback();
        }

        this.routeHandler.navigateTo("/");
    }
}