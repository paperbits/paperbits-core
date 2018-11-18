import * as ko from "knockout";
import template from "./pageSelector.html";
import { IResourceSelector } from "@paperbits/common/ui";
import { PageItem, AnchorItem } from "./pageItem";
import { IPageService, PageContract } from "@paperbits/common/pages";
import { Component, Param, Event } from "@paperbits/common/ko/decorators";

@Component({
    selector: "page-selector",
    template: template,
    injectable: "pageSelector"
})
export class PageSelector implements IResourceSelector<PageContract> {
    public readonly searchPattern: KnockoutObservable<string>;
    public readonly pages: KnockoutObservableArray<PageItem>;
    public readonly working: KnockoutObservable<boolean>;

    @Param()
    public selectedPage: KnockoutObservable<PageItem>;

    @Event()
    public onSelect: (selection: PageContract) => void;

    constructor(private readonly pageService: IPageService) {
        this.selectPage = this.selectPage.bind(this);
        this.selectAnchor = this.selectAnchor.bind(this);

        this.pages = ko.observableArray<PageItem>();
        this.selectedPage = ko.observable<PageItem>();
        this.searchPattern = ko.observable<string>();
        this.searchPattern.subscribe(this.searchPages);
        this.working = ko.observable(true);

        // setting up...
        this.pages = ko.observableArray<PageItem>();
        this.selectedPage = ko.observable<PageItem>();
        this.searchPattern = ko.observable<string>();
        this.searchPattern.subscribe(this.searchPages);
        this.working = ko.observable(true);

        this.searchPages();
    }

    public async searchPages(searchPattern: string = ""): Promise<void> {
        this.working(true);

        const pages = await this.pageService.search(searchPattern);
        const pageItems = pages.map(page => new PageItem(page));

        this.pages(pageItems);
        this.working(false);
    }

    public async selectPage(page: PageItem, anchorKey?: string): Promise<void> {
        this.selectedPage(page);

        if (this.onSelect) {
            this.onSelect(page.toContract());
        }
    }

    public async selectAnchor(anchor: AnchorItem): Promise<void> {
        if (this.onSelect) {
            this.onSelect(anchor.toContract());
        }
    }
}