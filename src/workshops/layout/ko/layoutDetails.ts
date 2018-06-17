import * as ko from "knockout";
import template from "./layoutDetails.html";
import { IRouteHandler } from '@paperbits/common/routing/IRouteHandler';
import { IViewManager } from '@paperbits/common/ui/IViewManager';
import { ILayoutService } from "@paperbits/common/layouts/ILayoutService";
import { LayoutItem } from "./layoutItem";
import { Component } from "@paperbits/knockout/decorators";

@Component({
    selector: "layout-details-workshop",
    template: template,
    injectable: "layoutDetails"
})
export class LayoutDetails {
    private readonly onDeleteCallback: () => void;

    public readonly layoutItem: LayoutItem;
    public isNotDefault: boolean;

    constructor(
        private readonly layoutService: ILayoutService,
        private readonly routeHandler: IRouteHandler,
        private readonly viewManager: IViewManager,
        params
    ) {

        // initialization...
        this.layoutItem = params.layoutItem;
        this.onDeleteCallback = params.onDeleteCallback;

        // rebinding...
        this.deleteLayout = this.deleteLayout.bind(this);
        this.updateLayout = this.updateLayout.bind(this);

        this.layoutItem.title
            .extend({ required: true })
            .subscribe(this.updateLayout);

        this.layoutItem.uriTemplate
            .extend({ uniqueLayoutUri: this.layoutItem.key })
            .subscribe(this.updateLayout);

        this.layoutItem.description
            .subscribe(this.updateLayout);

        this.init();
    }

    private async init(): Promise<void> {
        const uri = this.layoutItem.uriTemplate();
        this.isNotDefault = (uri !== "/");
        this.routeHandler.navigateTo(uri);
    }

    private async updateLayout(): Promise<void> {
        if (this.layoutItem.title.isValid()) {
            await this.layoutService.updateLayout(this.layoutItem.toLayout());
        }
    }

    public async deleteLayout(): Promise<void> {
        //TODO: Show confirmation dialog according to mockup
        await this.layoutService.deleteLayout(this.layoutItem.toLayout());

        this.viewManager.notifySuccess("Layouts", `Page "${this.layoutItem.title()}" was deleted.`);
        this.viewManager.closeWorkshop("layout-details-workshop");

        if (this.onDeleteCallback) {
            this.onDeleteCallback()
        }

        this.routeHandler.navigateTo("/");
    }
}