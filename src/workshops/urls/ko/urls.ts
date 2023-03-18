import * as ko from "knockout";
import template from "./urls.html";
import { IUrlService, UrlContract } from "@paperbits/common/urls";
import { ViewManager, View } from "@paperbits/common/ui";
import { Component, OnMounted } from "@paperbits/common/ko/decorators";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";
import { Query, Operator, Page } from "@paperbits/common/persistence";
import { UrlItem } from "./urlItem";
import { Router } from "@paperbits/common/routing";


@Component({
    selector: "urls",
    template: template
})
export class UrlsWorkshop {
    private currentUrlOfResults: Page<UrlContract>;
    private activeUrlPermalink: string;
    public readonly searchPattern: ko.Observable<string>;
    public readonly urls: ko.ObservableArray<UrlItem>;
    public readonly working: ko.Observable<boolean>;
    public readonly selectedUrl: ko.Observable<UrlItem>;

    constructor(
        private readonly urlService: IUrlService,
        private readonly viewManager: ViewManager,
        private readonly router: Router
    ) {
        this.urls = ko.observableArray<UrlItem>();
        this.selectedUrl = ko.observable<UrlItem>();
        this.searchPattern = ko.observable<string>("");
        this.working = ko.observable(false);
    }

    @OnMounted()
    public async initialize(): Promise<void> {
        await this.searchUrls();

        this.searchPattern
            .extend(ChangeRateLimit)
            .subscribe(this.searchUrls);
    }

    public async searchUrls(searchPattern: string = ""): Promise<void> {
        this.urls([]);

        const query = Query
            .from<UrlContract>()
            .orderBy(`title`);

        if (searchPattern) {
            query.where(`title`, Operator.contains, searchPattern);
        }

        const route = this.router.getCurrentRoute();
        this.activeUrlPermalink = route.path;

        this.working(true);
        this.currentUrlOfResults = await this.urlService.search(query);
        this.addUrlOfResults(this.currentUrlOfResults);
        this.working(false);
    }

    private addUrlOfResults(urlOfResult: Page<UrlContract>): void {
        const urlItems = urlOfResult.value.map(url => {
            const urlItem = new UrlItem(url);

            if (url.permalink === this.activeUrlPermalink) {
                this.selectedUrl(urlItem);
            }

            return urlItem;
        });

        this.urls.push(...urlItems);
    }

    public async loadNextUrl(): Promise<void> {
        if (!this.currentUrlOfResults?.takeNext) {
            return;
        }

        this.working(true);
        this.currentUrlOfResults = await this.currentUrlOfResults.takeNext();
        this.addUrlOfResults(this.currentUrlOfResults);
        this.working(false);
    }

    public selectUrl(urlItem: UrlItem): void {
        this.selectedUrl(urlItem);

        const view: View = {
            heading: "URL details",
            // returnFocusTo: ???
            component: {
                name: "url-details-workshop",
                params: {
                    urlItem: urlItem,
                    onDeleteCallback: () => {
                        this.searchUrls();
                    },
                    onCopyCallback: async (item: UrlItem) => {
                        await this.searchUrls();
                        this.selectUrl(item);
                    }
                }
            }
        };

        this.viewManager.openViewAsWorkshop(view);
    }

    public async addUrl(): Promise<void> {
        this.working(true);

        const permalink = "https://";

        const urlContract = await this.urlService.createUrl(permalink, "New URL", "");
        const urlItem = new UrlItem(urlContract);

        this.urls.push(urlItem);
        this.selectUrl(urlItem);

        this.working(false);
    }

    public isSelected(url: UrlItem): boolean {
        const selectedUrl = this.selectedUrl();
        return selectedUrl?.key === url.key;
    }
}