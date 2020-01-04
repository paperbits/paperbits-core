import * as ko from "knockout";
import template from "./urlSelector.html";
import { UrlItem } from "./urlItem";
import { IUrlService, UrlContract } from "@paperbits/common/urls";
import { Component, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";

@Component({
    selector: "url-selector",
    template: template
})
export class UrlSelector {
    public readonly searchPattern: ko.Observable<string>;
    public readonly urls: ko.ObservableArray<UrlItem>;
    public readonly uri: ko.Observable<string>;
    public readonly working: ko.Observable<boolean>;
    public readonly selectedUrl: ko.Observable<UrlItem>;

    private preSelectedModel: HyperlinkModel;

    constructor(private readonly urlService: IUrlService) {
        this.uri = ko.observable<string>("https://");
        this.urls = ko.observableArray();
        this.selectedUrl = ko.observable();
        this.searchPattern = ko.observable();
        this.working = ko.observable();
    }

    @Event()
    public onSelect: (url: UrlContract) => void;

    @OnMounted()
    public async onMounted(): Promise<void> {
        await this.searchUrls();

        this.searchPattern
            .extend(ChangeRateLimit)
            .subscribe(this.searchUrls);
    }

    public async searchUrls(searchPattern: string = ""): Promise<void> {
        this.working(true);

        const urls = await this.urlService.search(searchPattern);
        const urlItems = urls.map(url => new UrlItem(url));

        this.urls(urlItems);

        if (!this.selectedUrl() && this.preSelectedModel) {
            const currentPermalink = this.preSelectedModel.href;
            const current = urlItems.find(item => item.permalink() === currentPermalink);
            if (current) {
                await this.selectUrl(current);
            }
        }

        this.working(false);
    }

    public async selectUrl(urlItem: UrlItem, anchorKey?: string): Promise<void> {
        const uri = this.selectedUrl();
        if (uri) {
            uri.hasFocus(false);
        }
        urlItem.hasFocus(true);
        this.selectedUrl(urlItem);

        if (this.onSelect) {
            this.onSelect(urlItem.toUrl());
        }
    }

    public selectResource(resource: HyperlinkModel): void {
        this.preSelectedModel = resource;
    }

    public async createUrl(): Promise<void> {
        const newUri = this.uri();
        await this.urlService.createUrl(newUri, newUri);

        this.uri("https://");
        await this.searchUrls();
    }

    public async deleteUrl(): Promise<void> {
        const uri = this.selectedUrl();
        if (uri) {
            await this.urlService.deleteUrl(uri.toUrl());
        }
        this.uri("https://");
        await this.searchUrls();
    }
}