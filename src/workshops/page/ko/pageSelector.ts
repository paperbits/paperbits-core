import * as ko from "knockout";
import template from "./pageSelector.html";
import { IResourceSelector } from "@paperbits/common/ui";
import { PageItem, AnchorItem } from "./pageItem";
import { PageContract } from '@paperbits/common/pages';
import { IPermalinkService } from '@paperbits/common/permalinks';
import { IPageService } from '@paperbits/common/pages';
import { Component } from "@paperbits/knockout/decorators";

@Component({
    selector: "page-selector",
    template: template,
    injectable: "pageSelector"
})
export class PageSelector implements IResourceSelector<PageContract> {
    private readonly pageService: IPageService;
    private readonly permalinkService: IPermalinkService;

    public readonly searchPattern: KnockoutObservable<string>;
    public readonly pages: KnockoutObservableArray<PageItem>;
    public readonly working: KnockoutObservable<boolean>;

    public selectedPage: KnockoutObservable<PageItem>;
    public onResourceSelected: (selection: PageContract) => void;

    constructor(pageService: IPageService, permalinkService: IPermalinkService, onSelect: (page: PageContract) => void) {
        this.pageService = pageService;
        this.permalinkService = permalinkService;

        this.selectPage = this.selectPage.bind(this);
        this.selectAnchor = this.selectAnchor.bind(this);
        this.onResourceSelected = onSelect;

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

        if (this.onResourceSelected) {
            this.onResourceSelected(page.toContract());
        }
    }

    public async selectAnchor(anchor: AnchorItem): Promise<void> {
        if (this.onResourceSelected) {
            this.onResourceSelected(anchor.toContract());
        }
    }
}