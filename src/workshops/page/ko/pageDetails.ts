import * as ko from "knockout";
import template from "./pageDetails.html";
import { IPageService } from "@paperbits/common/pages";
import { Router } from "@paperbits/common/routing";
import { ViewManager } from "@paperbits/common/ui";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { PageItem } from "./pageItem";
import { ISettingsProvider } from "@paperbits/common/configuration";

@Component({
    selector: "page-details-workshop",
    template: template
})
export class PageDetailsWorkshop {
    public readonly isReserved: ko.Observable<boolean>;
    public readonly isSeoEnabled: ko.Observable<boolean>;

    constructor(
        private readonly pageService: IPageService,
        private readonly router: Router,
        private readonly viewManager: ViewManager,
        private readonly reservedPermalinks: string[],
        private readonly settingsProvider: ISettingsProvider
    ) {
        this.isReserved = ko.observable(false);
        this.isSeoEnabled = ko.observable(false);
    }

    @Param()
    public pageItem: PageItem;

    @Event()
    private readonly onDeleteCallback: () => void;

    @Event()
    private readonly onCopyCallback: (pageItem: PageItem) => void;

    @OnMounted()
    public async onMounted(): Promise<void> {
        const seoSetting = await this.settingsProvider.getSetting<boolean>("enableSeo");
        if (seoSetting) {
            this.isSeoEnabled(seoSetting);
        }
        
        this.pageItem.title
            .extend(<any>{ required: true, onlyValid: true })
            .subscribe(this.updatePage);

        this.pageItem.description
            .subscribe(this.updatePage);

        this.pageItem.keywords
            .subscribe(this.updatePage);

        let validPermalink = this.pageItem.permalink;

        if (this.reservedPermalinks.includes(this.pageItem.permalink())) {
            this.isReserved(true);
        }
        else {
            validPermalink = validPermalink.extend(<any>{ required: true, validPermalink: this.pageItem.key, onlyValid: true });
            validPermalink.subscribe(this.updatePermlaink);
        }

        await this.router.navigateTo(validPermalink());
        this.viewManager.setHost({ name: "page-host" });
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

    public async copyPage(): Promise<void> {
        const copyPermalink = `${this.pageItem.permalink()} copy`;
        const pageContract = await this.pageService.createPage(copyPermalink, `${this.pageItem.title()} copy`, this.pageItem.description(), this.pageItem.keywords());

        const copyContract = this.pageItem.toContract();
        copyContract.key = pageContract.key;
        copyContract.permalink = pageContract.permalink;
        copyContract.title = pageContract.title;
        copyContract.contentKey = pageContract.contentKey;

        await this.pageService.updatePage(copyContract);

        const pageContentContract = await this.pageService.getPageContent(this.pageItem.key);
        await this.pageService.updatePageContent(copyContract.key, pageContentContract);

        if (this.onCopyCallback) {
            this.onCopyCallback(new PageItem(copyContract));
        }
    }
}