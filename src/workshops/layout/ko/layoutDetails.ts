import * as ko from "knockout";
import template from "./layoutDetails.html";
import { ViewManager } from "@paperbits/common/ui";
import { ILayoutService } from "@paperbits/common/layouts/";
import { LayoutItem } from "./layoutItem";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { EventManager } from "@paperbits/common/events";

@Component({
    selector: "layout-details-workshop",
    template: template
})
export class LayoutDetails {
    public isDefaultLayout: ko.Computed<boolean>;
    public canDelete: ko.Computed<boolean>;
    public readonly permalinkTemplate: ko.Observable<string>;

    constructor(
        private readonly layoutService: ILayoutService,
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager
    ) {
        this.permalinkTemplate = ko.observable();
    }

    @Param()
    public readonly layoutItem: LayoutItem;

    @Event()
    public readonly onDeleteCallback: () => void;

    @Event()
    private readonly onCopyCallback: (layoutItem: LayoutItem) => void;

    @OnMounted()
    public async onMounted(): Promise<void> {
        this.layoutItem.title
            .extend(<any>{ required: true, onlyValid: true })
            .subscribe(this.updateLayout);

        this.permalinkTemplate(this.layoutItem.permalinkTemplate());

        const validPermalinkTemplate = this.permalinkTemplate
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

        this.viewManager.setHost({ name: "layout-host", params: { layoutKey: this.layoutItem.key } });

        this.eventManager.dispatchEvent("displayHint", {
            key: "48f5",
            content: `<p>You may have different page layouts for different parts of your website. Which layout gets applied at a given moment is determined by matching its URL template to URL of the current page.</p><p>Press Escape button to get back to the page editing.</p>`
        });
    }

    private async updateLayout(): Promise<void> {
        this.layoutItem.permalinkTemplate(this.permalinkTemplate());
        await this.layoutService.updateLayout(this.layoutItem.toContract());
    }

    public async deleteLayout(): Promise<void> {
        await this.layoutService.deleteLayout(this.layoutItem.toContract());

        this.viewManager.notifySuccess("Layouts", `Page "${this.layoutItem.title()}" was deleted.`);
        this.viewManager.closeWorkshop("layout-details-workshop");

        if (this.onDeleteCallback) {
            this.onDeleteCallback();
        }

        this.viewManager.setHost({ name: "page-host" }); // Returning to editing current page.
    }

    public async copyLayout(): Promise<void> {
        const copiedLayout = await this.layoutService.copyLayout(this.layoutItem.key);

        if (this.onCopyCallback) {
            this.onCopyCallback(new LayoutItem(copiedLayout));
        }
    }
}