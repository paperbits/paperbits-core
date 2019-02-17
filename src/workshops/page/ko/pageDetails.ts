import template from "./pageDetails.html";
import { IPageService } from "@paperbits/common/pages";
import { IRouteHandler } from "@paperbits/common/routing";
import { IViewManager } from "@paperbits/common/ui";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { PageItem } from "./pageItem";

@Component({
    selector: "page-details-workshop",
    template: template,
    injectable: "pageDetailsWorkshop"
})
export class PageDetailsWorkshop {
    @Param()
    public pageItem: PageItem;

    @Event()
    private readonly onDeleteCallback: () => void;

    constructor(
        private readonly pageService: IPageService,
        private readonly routeHandler: IRouteHandler,
        private readonly viewManager: IViewManager,
    ) {
        // rebinding...
        this.onMounted = this.onMounted.bind(this);
        this.deletePage = this.deletePage.bind(this);
        this.updatePage = this.updatePage.bind(this);
        this.updatePermlaink = this.updatePermlaink.bind(this);
    }

    @OnMounted()
    public async onMounted(): Promise<void> {
        this.pageItem.title
            .extend(<any>{ required: true, onlyValid: true })
            .subscribe(this.updatePage);

        this.pageItem.description
            .subscribe(this.updatePage);

        this.pageItem.keywords
            .subscribe(this.updatePage);

        this.pageItem.permalink
            .extend(<any>{ uniquePermalink: this.pageItem.permalink, required: true, onlyValid: true })
            .subscribe(this.updatePermlaink);


        this.viewManager.setHost({ name: "content-host" });
        this.routeHandler.navigateTo(this.pageItem.permalink());
    }

    private async updatePage(): Promise<void> {
        await this.pageService.updatePage(this.pageItem.toContract());
    }

    private async updatePermlaink(): Promise<void> {
        const permalink = this.pageItem.permalink();
        this.routeHandler.notifyListeners = false;
        this.routeHandler.navigateTo(permalink);
        this.routeHandler.notifyListeners = true;

        this.updatePage();
    }

    public async deletePage(): Promise<void> {
        // TODO: Show confirmation dialog according to mockup
        await this.pageService.deletePage(this.pageItem.toContract());

        this.viewManager.notifySuccess("Pages", `Page "${this.pageItem.title()}" was deleted.`);
        this.viewManager.closeWorkshop("page-details-workshop");

        if (this.onDeleteCallback) {
            this.onDeleteCallback();
        }

        this.routeHandler.navigateTo("/");
    }
}