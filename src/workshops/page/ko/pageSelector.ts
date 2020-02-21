import * as ko from "knockout";
import template from "./pageSelector.html";
import { IResourceSelector } from "@paperbits/common/ui";
import { PageItem, AnchorItem } from "./pageItem";
import { IPageService } from "@paperbits/common/pages";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { AnchorUtils } from "../../../text/anchorUtils";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";

@Component({
    selector: "page-selector",
    template: template
})
export class PageSelector implements IResourceSelector<HyperlinkModel> {
    public readonly searchPattern: ko.Observable<string>;
    public readonly pages: ko.ObservableArray<PageItem>;
    public readonly working: ko.Observable<boolean>;

    private preSelectedModel: HyperlinkModel;

    @Param()
    public selectedPage: ko.Observable<PageItem>;

    @Event()
    public onSelect: (selection: HyperlinkModel) => void;

    constructor(private readonly pageService: IPageService) {
        this.pages = ko.observableArray();
        this.selectedPage = ko.observable();
        this.searchPattern = ko.observable();
        this.working = ko.observable();
    }

    @OnMounted()
    public async onMounted(): Promise<void> {
        await this.searchPages();

        this.searchPattern
            .extend(ChangeRateLimit)
            .subscribe(this.searchPages);
    }

    public async searchPages(searchPattern: string = ""): Promise<void> {
        this.working(true);

        const pages = await this.pageService.search(searchPattern);
        const pageItems = pages.map(page => new PageItem(page));

        this.pages(pageItems);

        if (!this.selectedPage() && this.preSelectedModel) {
            const currentPermalink = this.preSelectedModel.href;
            const current = pageItems.find(item => item.permalink() === currentPermalink);

            if (current) {
                await this.selectPage(current);
                const currentAnchors = current.anchors();

                if (this.preSelectedModel.anchor) {
                    const currentAnchor = currentAnchors.find(item => item.elementId === this.preSelectedModel.anchor);

                    if (currentAnchor) {
                        await this.selectAnchor(currentAnchor);
                    }
                }
            }
        }

        this.working(false);
    }

    public async selectPage(page: PageItem): Promise<void> {
        const prev = this.selectedPage();

        if (prev) {
            prev.isSelected(false);

            if (prev.selectedAnchor) {
                prev.selectedAnchor.isSelected(false);
            }
        }

        this.selectedPage(page);
        page.isSelected(true);

        await this.getAnchors(page);

        if (this.onSelect) {
            this.onSelect(page.getHyperlink());
        }
    }

    public selectResource(resource: HyperlinkModel): void {
        this.preSelectedModel = resource;
    }

    public async selectAnchor(anchor: AnchorItem): Promise<void> {
        if (this.onSelect) {
            const selectedPage = this.selectedPage();
            anchor.isSelected(true);
            selectedPage.selectedAnchor = anchor;
            this.onSelect(selectedPage.getHyperlink());
        }
    }

    private async getAnchors(pageItem: PageItem): Promise<void> {
        const pageContent = await this.pageService.getPageContent(pageItem.key);
        const children = AnchorUtils.getHeadingNodes(pageContent, 1, 6);
        let selectedAnchor: AnchorItem;

        const anchors = children
            .filter(item => item.nodes?.length > 0)
            .map(item => {
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
            this.selectAnchor(selectedAnchor);
        }
    }
}