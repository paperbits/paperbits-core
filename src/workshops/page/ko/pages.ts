import * as ko from "knockout";
import template from "./pages.html";
import { IPageService, PageContract } from "@paperbits/common/pages";
import { ViewManager, View } from "@paperbits/common/ui";
import { Component, OnMounted } from "@paperbits/common/ko/decorators";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";
import { Query, Operator, Page } from "@paperbits/common/persistence";
import { PageItem } from "./pageItem";
import { Router } from "@paperbits/common/routing";


@Component({
    selector: "pages",
    template: template
})
export class PagesWorkshop {
    private currentPageOfResults: Page<PageContract>;
    private activePagePermalink: string;
    public readonly searchPattern: ko.Observable<string>;
    public readonly pages: ko.ObservableArray<PageItem>;
    public readonly working: ko.Observable<boolean>;
    public readonly selectedPage: ko.Observable<PageItem>;

    constructor(
        private readonly pageService: IPageService,
        private readonly viewManager: ViewManager,
        private readonly router: Router
    ) {
        this.pages = ko.observableArray<PageItem>();
        this.selectedPage = ko.observable<PageItem>();
        this.searchPattern = ko.observable<string>("");
        this.working = ko.observable(false);
    }

    @OnMounted()
    public async initialize(): Promise<void> {
        await this.searchPages();

        this.searchPattern
            .extend(ChangeRateLimit)
            .subscribe(this.searchPages);
    }

    public async searchPages(searchPattern: string = ""): Promise<void> {
        this.pages([]);

        const query = Query
            .from<PageContract>()
            .orderBy(`title`);

        if (searchPattern) {
            query.where(`title`, Operator.contains, searchPattern);
        }

        const route = this.router.getCurrentRoute();
        this.activePagePermalink = route.path;

        this.working(true);
        this.currentPageOfResults = await this.pageService.search(query);
        this.addPageOfResults(this.currentPageOfResults);
        this.working(false);
    }

    private addPageOfResults(pageOfResult: Page<PageContract>): void {
        const pageItems = pageOfResult.value.map(page => {
            const pageItem = new PageItem(page);

            if (page.permalink === this.activePagePermalink) {
                this.selectedPage(pageItem);
            }

            return pageItem;
        });

        this.pages.push(...pageItems);
    }

    public async loadNextPage(): Promise<void> {
        if (!this.currentPageOfResults?.takeNext) {
            return;
        }

        this.working(true);
        this.currentPageOfResults = await this.currentPageOfResults.takeNext();
        this.addPageOfResults(this.currentPageOfResults);
        this.working(false);
    }

    public selectPage(pageItem: PageItem): void {
        this.selectedPage(pageItem);

        const view: View = {
            heading: "Page",
            // returnFocusTo: ???
            component: {
                name: "page-details-workshop",
                params: {
                    pageItem: pageItem,
                    onDeleteCallback: () => {
                        this.searchPages();
                    },
                    onCopyCallback: async (item: PageItem) => {
                        await this.searchPages();
                        this.selectPage(item);
                    }
                }
            }
        };

        this.viewManager.openViewAsWorkshop(view);
    }

    public async addPage(): Promise<void> {
        this.working(true);

        const pageUrl = "/new-page";

        const pageContract = await this.pageService.createPage(pageUrl, "New page", "", "");
        const pageItem = new PageItem(pageContract);

        this.pages.push(pageItem);
        this.selectPage(pageItem);

        this.working(false);
    }

    public isSelected(page: PageItem): boolean {
        const selectedPage = this.selectedPage();
        return selectedPage?.key === page.key;
    }
}