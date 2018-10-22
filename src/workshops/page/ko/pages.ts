import * as ko from "knockout";
import template from "./pages.html";
import { IPageService } from "@paperbits/common/pages";
import { IRouteHandler } from "@paperbits/common/routing";
import { IPermalinkService } from "@paperbits/common/permalinks";
import { IViewManager } from "@paperbits/common/ui";
import { IFileService } from "@paperbits/common/files";
import { Keys } from "@paperbits/common/keyboard";
import { IBlockService } from "@paperbits/common/blocks";
import { Component } from "../../../ko/decorators/component.decorator";
import { PageItem } from "./pageItem";
import { LayoutViewModelBinder } from "../../../layout/ko";

const templateBlockKey = "blocks/8730d297-af39-8166-83b6-9439addca789";

@Component({
    selector: "pages",
    template: template,
    injectable: "pagesWorkshop"
})
export class PagesWorkshop {
    private searchTimeout: any;

    public readonly searchPattern: KnockoutObservable<string>;
    public readonly pages: KnockoutObservableArray<PageItem>;
    public readonly working: KnockoutObservable<boolean>;
    public readonly selectedPage: KnockoutObservable<PageItem>;

    constructor(
        private readonly pageService: IPageService,
        private readonly fileService: IFileService,
        private readonly permalinkService: IPermalinkService,
        private readonly routeHandler: IRouteHandler,
        private readonly blockService: IBlockService,
        private readonly viewManager: IViewManager,
        private readonly layoutViewModelBinder: LayoutViewModelBinder
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
        this.working(true);
        const pages = await this.pageService.search(searchPattern);
        const pageItems = pages.map(page => new PageItem(page));

        this.pages(pageItems);
        this.working(false);
    }

    public async searchPages(searchPattern: string = ""): Promise<void> {
        clearTimeout(this.searchTimeout);

        this.searchTimeout = setTimeout(() => {
            this.launchSearch(searchPattern);
        }, 600);
    }

    public selectPage(pageItem: PageItem): void {
        this.selectedPage(pageItem);
        this.viewManager.setDocument({ src: "/page.html", getLayoutViewModel: this.layoutViewModelBinder.getLayoutViewModel });
        this.viewManager.setTitle(null, pageItem.toContract());
        this.viewManager.openViewAsWorkshop("Page", "page-details-workshop", {
            pageItem: pageItem,
            onDeleteCallback: () => {
                this.searchPages();
            }
        });
    }

    public async addPage(): Promise<void> {
        this.working(true);

        const page = await this.pageService.createPage("New page", "", "");
        const createPermalinkPromise = this.permalinkService.createPermalink("/new", page.key);
        const contentTemplate = await this.blockService.getBlockByKey(templateBlockKey);

        const template = {
            object: "block",
            nodes: [contentTemplate.content],
            type: "page"
        };

        const createContentPromise = this.fileService.createFile(template);
        const results = await Promise.all<any>([createPermalinkPromise, createContentPromise]);
        const permalink = results[0];
        const content = results[1];

        page.permalinkKey = permalink.key;
        page.contentKey = content.key;

        await this.pageService.updatePage(page);

        this.routeHandler.navigateTo(permalink.uri);

        const pageItem = new PageItem(page);

        this.pages.push(pageItem);
        this.selectPage(pageItem);
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