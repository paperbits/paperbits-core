import * as ko from "knockout";
import template from "./urlSelector.html";
import { UrlItem } from "./urlItem";
import { IUrlService, UrlContract } from "@paperbits/common/urls";
import { Component, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";
import { Query, Operator, Page } from "@paperbits/common/persistence";
import { HyperlinkModel } from "@paperbits/common/permalinks";

@Component({
    selector: "url-selector",
    template: template
})
export class UrlSelector {
    private currentPage: Page<UrlContract>;
    public readonly searchPattern: ko.Observable<string>;
    public readonly urls: ko.ObservableArray<UrlItem>;
    public readonly uri: ko.Observable<string>;
    public readonly working: ko.Observable<boolean>;
    public readonly selectedUrl: ko.Observable<UrlItem>;

    constructor(private readonly urlService: IUrlService) {
        this.uri = ko.observable<string>("https://");
        this.urls = ko.observableArray();
        this.selectedUrl = ko.observable();
        this.searchPattern = ko.observable();
        this.working = ko.observable(false);
    }

    @Event()
    public onSelect: (selection: UrlContract) => void;

    @Event()
    public onHyperlinkSelect: (selection: HyperlinkModel) => void;

    @OnMounted()
    public async onMounted(): Promise<void> {
        await this.searchUrls();

        this.searchPattern
            .extend(ChangeRateLimit)
            .subscribe(this.searchUrls);
    }
    
    public async searchUrls(searchPattern: string = ""): Promise<void> {
        this.working(true);
        this.urls([]);

        const query = Query
            .from<UrlContract>()
            .orderBy(`title`);

        if (searchPattern) {
            query.where(`title`, Operator.contains, searchPattern);
        }

        const pageOfResults = await this.urlService.search(query);
        this.currentPage = pageOfResults;

        const urlItems = pageOfResults.value.map(media => new UrlItem(media));
        this.urls.push(...urlItems);

        this.working(false);
    }

    public async loadNextPage(): Promise<void> {
        if (!this.currentPage?.takeNext || this.working()) {
            return;
        }

        this.working(true);

        this.currentPage = await this.currentPage.takeNext();

        const urlItems = this.currentPage.value.map(page => new UrlItem(page));
        this.urls.push(...urlItems);

        this.working(false);
    }

    public async selectUrl(urlItem: UrlItem): Promise<void> {
        const uri = this.selectedUrl();

        if (uri) {
            uri.hasFocus(false);
        }
        urlItem.hasFocus(true);
        this.selectedUrl(urlItem);

        if (this.onSelect) {
            this.onSelect(urlItem.toContract());
        }

        if (this.onHyperlinkSelect) {
            this.onHyperlinkSelect(urlItem.getHyperlink());
        }
    }

    public async createUrl(): Promise<void> {
        const newUri = this.uri();
        const urlContract = await this.urlService.createUrl(newUri, newUri);
        const urlItem = new UrlItem(urlContract);

        if (this.onHyperlinkSelect) {
            this.onHyperlinkSelect(urlItem.getHyperlink());
        }
    }

    public async deleteUrl(): Promise<void> {
        const uri = this.selectedUrl();

        if (uri) {
            await this.urlService.deleteUrl(uri.toContract());
        }
        this.uri("https://");
        await this.searchUrls();
    }
}