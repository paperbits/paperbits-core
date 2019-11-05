import * as ko from "knockout";
import template from "./layoutDetails.html";
import { Router } from "@paperbits/common/routing";
import { ViewManager } from "@paperbits/common/ui";
import { ILayoutService } from "@paperbits/common/layouts/";
import { LayoutItem } from "./layoutItem";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";

@Component({
    selector: "layout-details-workshop",
    template: template,
    injectable: "layoutDetails"
})
export class LayoutDetails {
    public isDefaultLayout: ko.Computed<boolean>;
    public canDelete: ko.Computed<boolean>;

    constructor(
        private readonly layoutService: ILayoutService,
        private readonly router: Router,
        private readonly viewManager: ViewManager
    ) { }

    @Param()
    public readonly layoutItem: LayoutItem;

    @Event()
    public readonly onDeleteCallback: () => void;

    @OnMounted()
    public async onMounted(): Promise<void> {
        this.layoutItem.title
            .extend(<any>{ required: true, onlyValid: true })
            .subscribe(this.updateLayout);

        const validPermalinkTemplate = this.layoutItem.permalinkTemplate
            .extend(<any>{ uniqueLayoutUri: this.layoutItem.key, required: true, onlyValid: true });

        validPermalinkTemplate.subscribe(this.updateLayout);

        this.layoutItem.description
            .subscribe(this.updateLayout);

        this.isDefaultLayout = ko.pureComputed(() => {
            return validPermalinkTemplate() === "/";
        });

        this.canDelete = ko.computed(() => {
            return !this.isDefaultLayout();
        });

        const permalinkTemplate = validPermalinkTemplate();

        await this.router.navigateTo(permalinkTemplate, this.layoutItem.title(), { routeKind: "layout" });
    }

    private async updateLayout(): Promise<void> {
        await this.layoutService.updateLayout(this.layoutItem.toLayout());
    }

    public async deleteLayout(): Promise<void> {
        await this.layoutService.deleteLayout(this.layoutItem.toLayout());

        this.viewManager.notifySuccess("Layouts", `Page "${this.layoutItem.title()}" was deleted.`);
        this.viewManager.closeWorkshop("layout-details-workshop");

        if (this.onDeleteCallback) {
            this.onDeleteCallback();
        }

        await this.router.navigateTo("/");
    }
}