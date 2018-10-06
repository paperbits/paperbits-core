import * as ko from "knockout";
import template from "./urlSelector.html";
import { UrlItem } from "./urlItem";
import { UrlContract } from "@paperbits/common/urls/urlContract";
import { IPermalinkService } from "@paperbits/common/permalinks";
import { IUrlService } from "@paperbits/common/urls/IUrlService";
import { Component, Event } from "../../../ko/decorators";

@Component({
    selector: "url-selector",
    template: template,
    injectable: "urlSelector"
})
export class UrlSelector {
    private readonly urlService: IUrlService;
    private readonly permalinkService: IPermalinkService;

    public readonly searchPattern: KnockoutObservable<string>;
    public readonly urls: KnockoutObservableArray<UrlItem>;
    public readonly uri: KnockoutObservable<string>;
    public readonly working: KnockoutObservable<boolean>;
    public readonly selectedUrl: KnockoutObservable<UrlItem>;

    @Event()
    public onSelect: (url: UrlContract) => void;

    constructor(urlService: IUrlService, permalinkService: IPermalinkService) {
        this.urlService = urlService;
        this.permalinkService = permalinkService;

        this.selectUrl = this.selectUrl.bind(this);
        this.createUrl = this.createUrl.bind(this);

        this.uri = ko.observable<string>("https://");
        this.urls = ko.observableArray<UrlItem>();
        this.selectedUrl = ko.observable<UrlItem>();
        this.searchPattern = ko.observable<string>();
        this.searchPattern.subscribe(this.searchUrls);
        this.working = ko.observable(true);

        // setting up...
        this.urls = ko.observableArray<UrlItem>();
        this.selectedUrl = ko.observable<UrlItem>();
        this.searchPattern = ko.observable<string>();
        this.searchPattern.subscribe(this.searchUrls);
        this.working = ko.observable(true);

        this.searchUrls();
    }

    public async searchUrls(searchPattern: string = ""): Promise<void> {
        this.working(true);

        const urls = await this.urlService.search(searchPattern);
        const urlItems = urls.map(url => new UrlItem(url));

        this.urls(urlItems);
        this.working(false);
    }

    public async selectUrl(urlItem: UrlItem, anchorKey?: string): Promise<void> {
        this.selectedUrl(urlItem);

        if (this.onSelect) {
            this.onSelect(urlItem.toUrl());
        }
    }

    public async createUrl(): Promise<void> {
        const newUri = this.uri();

        const url = await this.urlService.createUrl(newUri);
        const permalink = await this.permalinkService.createPermalink(newUri, url.key);

        url.permalinkKey = permalink.key;

        await this.urlService.updateUrl(url);

        this.uri("https://");
        await this.searchUrls();
    }
}