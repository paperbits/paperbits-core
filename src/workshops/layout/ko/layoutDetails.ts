import * as ko from "knockout";
import template from "./layoutDetails.html";
import { IRouteHandler } from "@paperbits/common/routing";
import { IViewManager } from "@paperbits/common/ui";
import { ILayoutService } from "@paperbits/common/layouts/";
import { LayoutItem } from "./layoutItem";
import { Component, Param, Event, OnMounted } from "../../../ko/decorators";

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

    public isNotDefault: boolean;

    constructor(
        private readonly layoutService: ILayoutService,
        private readonly routeHandler: IRouteHandler,
        private readonly viewManager: IViewManager
    ) {
        // rebinding...
        this.onMounted = this.onMounted.bind(this);
        this.deleteLayout = this.deleteLayout.bind(this);
        this.updateLayout = this.updateLayout.bind(this);
    }

    @OnMounted()
    public async onMounted(): Promise<void> {
        this.layoutItem.title
            .extend({ required: true })
            .subscribe(this.updateLayout);

        this.layoutItem.uriTemplate
            .extend({ uniqueLayoutUri: this.layoutItem.key })
            .subscribe(this.updateLayout);

        this.layoutItem.description
            .subscribe(this.updateLayout);

        const uri = this.layoutItem.uriTemplate();
        this.isNotDefault = (uri !== "/");
        this.routeHandler.navigateTo(uri, { usePagePlaceholder: true });
    }

    private async updateLayout(): Promise<void> {
        if (this.layoutItem.title.isValid()) {
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