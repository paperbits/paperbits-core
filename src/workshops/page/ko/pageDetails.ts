import * as ko from "knockout";
import template from "./pageDetails.html";
import { IPageService } from "@paperbits/common/pages";
import { Router } from "@paperbits/common/routing";
import { ViewManager } from "@paperbits/common/ui";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { PageItem } from "./pageItem";

@Component({
    selector: "page-details-workshop",
    template: template,
    injectable: "pageDetailsWorkshop"
})
export class PageDetailsWorkshop {
    public isHomePage: ko.Computed<boolean>;
    public canDelete: ko.Computed<boolean>;

    constructor(
        private readonly pageService: IPageService,
        private readonly router: Router,
        private readonly viewManager: ViewManager,
    ) {
        this.onMounted = this.onMounted.bind(this);
        this.deletePage = this.deletePage.bind(this);
        this.updatePage = this.updatePage.bind(this);
        this.updatePermlaink = this.updatePermlaink.bind(this);
    }

    @Param()
    public pageItem: PageItem;

    @Event()
    private readonly onDeleteCallback: () => void;

    @OnMounted()
    public async onMounted(): Promise<void> {
        this.pageItem.title
            .extend(<any>{ required: true, onlyValid: true })
            .subscribe(this.updatePage);

        this.pageItem.description
            .subscribe(this.updatePage);

        this.pageItem.keywords
            .subscribe(this.updatePage);

        const validPermalink = this.pageItem.permalink
            .extend(<any>{ required: true, uniquePermalink: this.pageItem.key, onlyValid: true });

        validPermalink.subscribe(this.updatePermlaink);

        this.isHomePage = ko.pureComputed(() => {
            return validPermalink() === "/";
        });

        this.canDelete = ko.computed(() => {
            return !this.isHomePage();
        });

        this.viewManager.setHost({ name: "content-host" });
        await this.router.navigateTo(validPermalink());
    }

    private async updatePage(): Promise<void> {
        await this.pageService.updatePage(this.pageItem.toContract());
    }

    private async updatePermlaink(): Promise<void> {
        const permalink = this.pageItem.permalink();
        this.router.updateHistory(permalink, this.pageItem.title());

        await this.updatePage();
    }

    public async deletePage(): Promise<void> {
        await this.pageService.deletePage(this.pageItem.toContract());

        this.viewManager.notifySuccess("Pages", `Page "${this.pageItem.title()}" was deleted.`);
        this.viewManager.closeWorkshop("page-details-workshop");

        if (this.onDeleteCallback) {
            this.onDeleteCallback();
        }

        this.router.navigateTo("/");
    }
}