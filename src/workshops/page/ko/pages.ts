import * as ko from "knockout";
import template from "./pages.html";
import { IPageService } from "@paperbits/common/pages";
import { Router } from "@paperbits/common/routing";
import { IViewManager } from "@paperbits/common/ui";
import { Keys } from "@paperbits/common/keyboard";
import { Component, OnMounted } from "@paperbits/common/ko/decorators";
import { PageItem } from "./pageItem";


@Component({
    selector: "pages",
    template: template,
    injectable: "pagesWorkshop"
})
export class PagesWorkshop {
    private searchTimeout: any;

    public readonly searchPattern: ko.Observable<string>;
    public readonly pages: ko.ObservableArray<PageItem>;
    public readonly working: ko.Observable<boolean>;
    public readonly selectedPage: ko.Observable<PageItem>;

    constructor(
        private readonly pageService: IPageService,
        private readonly router: Router,
        private readonly viewManager: IViewManager
    ) {
        this.pages = ko.observableArray<PageItem>();
        this.selectedPage = ko.observable<PageItem>();
        this.searchPattern = ko.observable<string>("");
        this.working = ko.observable(true);
    }

    @OnMounted()
    public async initialize(): Promise<void> {
        this.searchPattern.subscribe(this.searchPages);
        this.searchPages();
    }

    private async launchSearch(searchPattern: string = ""): Promise<void> {
        this.working(true);
        this.pages([]);

        const pages = await this.pageService.search(searchPattern);
        const pageItems = pages.map(page => new PageItem(page));

        this.pages(pageItems);
        this.working(false);
    }

    public async searchPages(searchPattern: string = ""): Promise<void> {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => this.launchSearch(searchPattern), 600);
    }

    public selectPage(pageItem: PageItem): void {
        this.selectedPage(pageItem);

        this.viewManager.openViewAsWorkshop("Page", "page-details-workshop", {
            pageItem: pageItem,
            onDeleteCallback: () => {
                this.searchPages();
            }
        });
    }

    public async addPage(): Promise<void> {
        this.working(true);

        const pageUrl = "/new";
        const pageContract = await this.pageService.createPage(pageUrl, "New page", "", "");
        const pageItem = new PageItem(pageContract);

        this.pages.push(pageItem);
        this.selectPage(pageItem);

        this.working(false);
    }

    public async deleteSelectedPage(): Promise<void> {
        // TODO: Show confirmation dialog according to mockup
        this.viewManager.closeWorkshop("page-details-workshop");

        await this.pageService.deletePage(this.selectedPage().toContract());
        await this.searchPages();

        this.router.navigateTo("/");
    }

    public onKeyDown(item: PageItem, event: KeyboardEvent): boolean {
        if (event.keyCode === Keys.Delete) {
            this.deleteSelectedPage();
        }
        return true;
    }
}