import * as ko from "knockout";
import template from "./pageDetails.html";
import { IPermalink } from "@paperbits/common/permalinks";
import { IPermalinkService } from "@paperbits/common/permalinks";
import { IPageService } from "@paperbits/common/pages/IPageService";
import { IRouteHandler } from "@paperbits/common/routing/IRouteHandler";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { Component } from "../../../ko/component";
import { PageItem } from "./pageItem";

@Component({
    selector: "page-details-workshop",
    template: template,
    injectable: "pageDetailsWorkshop"
})
export class PageDetailsWorkshop {
    private pagePermalink: IPermalink;
    private readonly onDeleteCallback: () => void;

    public pageItem: PageItem;

    constructor(
        private readonly pageService: IPageService,
        private readonly permalinkService: IPermalinkService,
        private readonly routeHandler: IRouteHandler,
        private readonly viewManager: IViewManager,
        params
    ) {

        // initialization...
        this.pageItem = params.pageItem;
        this.onDeleteCallback = params.onDeleteCallback;

        // rebinding...
        this.deletePage = this.deletePage.bind(this);
        this.updatePage = this.updatePage.bind(this);
        this.updatePermlaink = this.updatePermlaink.bind(this);

        this.pageItem.title
            .extend({ required: true, onlyValid: true })
            .subscribe(this.updatePage);

        this.pageItem.description
            .subscribe(this.updatePage);

        this.pageItem.keywords
            .subscribe(this.updatePage);

        this.pageItem.permalinkUrl
            .extend({ uniquePermalink: this.pageItem.permalinkKey, required: true, onlyValid: true })
            .subscribe(this.updatePermlaink);

        this.init();
    }

    private async init(): Promise<void> {
        const permalink = await this.permalinkService.getPermalinkByKey(this.pageItem.permalinkKey);

        this.pagePermalink = permalink;
        this.pageItem.permalinkUrl(permalink.uri);
        this.routeHandler.navigateTo(permalink.uri);
    }

    private async updatePage(): Promise<void> {
        await this.pageService.updatePage(this.pageItem.toContract());
        this.viewManager.setTitle(null, this.pageItem.toContract());
    }

    private async updatePermlaink(): Promise<void> {
        this.pagePermalink.uri = this.pageItem.permalinkUrl();
        await this.permalinkService.updatePermalink(this.pagePermalink);
    }

    public async deletePage(): Promise<void> {
        //TODO: Show confirmation dialog according to mockup
        await this.pageService.deletePage(this.pageItem.toContract());

        this.viewManager.notifySuccess("Pages", `Page "${this.pageItem.title()}" was deleted.`);
        this.viewManager.closeWorkshop("page-details-workshop");

        if (this.onDeleteCallback) {
            this.onDeleteCallback()
        }

        this.routeHandler.navigateTo("/");
    }
}