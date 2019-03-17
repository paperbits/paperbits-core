import * as ko from "knockout";
import template from "./pageSelector.html";
import { IResourceSelector } from "@paperbits/common/ui";
import { PageItem, AnchorItem } from "./pageItem";
import { IPageService } from "@paperbits/common/pages";
import { Component, Param, Event } from "@paperbits/common/ko/decorators";
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { AnchorUtils } from "../../../text/anchorUtils";

@Component({
    selector: "page-selector",
    template: template,
    injectable: "pageSelector"
})
export class PageSelector implements IResourceSelector<HyperlinkModel> {
    public readonly searchPattern: ko.Observable<string>;
    public readonly pages: ko.ObservableArray<PageItem>;
    public readonly working: ko.Observable<boolean>;

    @Param()
    public selectedPage: ko.Observable<PageItem>;

    @Event()
    public onSelect: (selection: HyperlinkModel) => void;

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
        if (!page.hasFocus()) {
            return;
        }
        this.selectedPage(page);
        await this.getAnchors(page);

        if (this.onSelect) {
            this.onSelect(page.getHyperlink());
        }
    }

    public async selectAnchor(anchor: AnchorItem): Promise<void> {
        if (!anchor.hasFocus()) {
            return;
        }
        if (this.onSelect) {
            const selectedPage = this.selectedPage();
            selectedPage.selectedAnchor = anchor;
            this.onSelect(selectedPage.getHyperlink());
        }
    }

    private async getAnchors(pageItem: PageItem) {
        const pageContent = await this.pageService.getPageContent(pageItem.key);
        const children = AnchorUtils.getHeadingNodes(pageContent);

        const anchors = children.map(item => {
            const anchor = new AnchorItem();
            anchor.shortTitle = item.content[0].text;
            anchor.elementId = item.attrs.id;
            return anchor;
        });
        pageItem.anchors(anchors);
    }
}