import * as ko from "knockout";
import template from "./pageSelector.html";
import { IResourceSelector } from "@paperbits/common/ui";
import { PageItem, AnchorItem } from "./pageItem";
import { IPageService } from "@paperbits/common/pages";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
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
        this.onMounted = this.onMounted.bind(this);
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
    
    @OnMounted()
    public onMounted(): void {
        setTimeout(() => {            
            if (this.selectedPage()) {
                console.log("selected page", this.selectedPage());
            }
        }, 300);
    }

    public async searchPages(searchPattern: string = ""): Promise<void> {
        this.working(true);

        const pages = await this.pageService.search(searchPattern);
        const pageItems = pages.map(page => new PageItem(page));

        this.pages(pageItems);
        this.working(false);
    }

    public async selectPage(page: PageItem): Promise<void> {
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
        let selectedAnchor: AnchorItem;

        const anchors = children.map(item => {
            const anchor = new AnchorItem();
            anchor.shortTitle = item.nodes[0].text;
            anchor.elementId = item.attrs.id;
            if (pageItem.selectedAnchor && pageItem.selectedAnchor.elementId === anchor.elementId) {
                selectedAnchor = anchor;
            }
            return anchor;
        });
        pageItem.anchors(anchors);
        if (selectedAnchor) {
            selectedAnchor.hasFocus(true);
            this.selectAnchor(selectedAnchor);
        }
    }
}