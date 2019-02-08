import * as ko from "knockout";
import template from "./pages.html";
import { IPageService } from "@paperbits/common/pages";
import { IRouteHandler } from "@paperbits/common/routing";
import { IViewManager } from "@paperbits/common/ui";
import { Keys } from "@paperbits/common/keyboard";
import { Component } from "@paperbits/common/ko/decorators";
import { PageItem } from "./pageItem";
import { LayoutViewModelBinder } from "../../../layout/ko";


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
        private readonly routeHandler: IRouteHandler,
        private readonly viewManager: IViewManager
    ) {
        // rebinding...
        this.searchPages = this.searchPages.bind(this);
        this.addPage = this.addPage.bind(this);
        this.selectPage = this.selectPage.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);

        // setting up...
        this.pages = ko.observableArray<PageItem>();
        this.selectedPage = ko.observable<PageItem>();
        this.searchPattern = ko.observable<string>("");
        this.searchPattern.subscribe(this.searchPages);
        this.working = ko.observable(true);

        this.searchPages();
    }

    private async launchSearch(searchPattern: string = ""): Promise<void> {
        const pages = await this.pageService.search(searchPattern);
        const pageItems = pages.map(page => new PageItem(page));

        this.pages(pageItems);
    }

    public async searchPages(searchPattern: string = ""): Promise<void> {
        this.working(true);
        this.pages([]);
        clearTimeout(this.searchTimeout);

        this.searchTimeout = setTimeout(async () => {
            await this.launchSearch(searchPattern);
            this.working(false);
        }, 600);
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

        this.routeHandler.navigateTo(pageUrl);
        this.working(false);
    }

    public async deleteSelectedPage(): Promise<void> {
        // TODO: Show confirmation dialog according to mockup
        this.viewManager.closeWorkshop("page-details-workshop");

        await this.pageService.deletePage(this.selectedPage().toContract());
        await this.searchPages();

        this.routeHandler.navigateTo("/");
    }

    public onKeyDown(item: PageItem, event: KeyboardEvent): boolean {
        if (event.keyCode === Keys.Delete) {
            this.deleteSelectedPage();
        }
        return true;
    }
}


