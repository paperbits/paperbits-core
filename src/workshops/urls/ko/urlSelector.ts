import * as ko from "knockout";
import template from "./urlSelector.html";
import { UrlItem } from "./urlItem";
import { IUrlService, UrlContract } from "@paperbits/common/urls";
import { Component, Event } from "@paperbits/common/ko/decorators";

@Component({
    selector: "url-selector",
    template: template,
    injectable: "urlSelector"
})
export class UrlSelector {
    public readonly searchPattern: KnockoutObservable<string>;
    public readonly urls: KnockoutObservableArray<UrlItem>;
    public readonly uri: KnockoutObservable<string>;
    public readonly working: KnockoutObservable<boolean>;
    public readonly selectedUrl: KnockoutObservable<UrlItem>;

    @Event()
    public onSelect: (url: UrlContract) => void;

    constructor(private readonly urlService: IUrlService) {
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
        await this.urlService.createUrl(newUri, newUri);

        this.uri("https://");
        await this.searchUrls();
    }
}