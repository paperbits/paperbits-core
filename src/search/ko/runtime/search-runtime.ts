import * as ko from "knockout";
import template from "./search-runtime.html";
import { stripHtml } from "@paperbits/common/utils";
import { HttpClient } from "@paperbits/common/http";
import { Component, RuntimeComponent, OnMounted } from "@paperbits/common/ko/decorators";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";
import { MimeTypes } from "@paperbits/common";
import { SearchResult, SearchResultBuilder } from "@paperbits/common/search";
import { SearchService, StaticSearchService } from "@paperbits/common/search/staticSearchService";



@RuntimeComponent({ selector: "search-runtime" })
@Component({
    selector: "search-runtime",
    template: template
})
export class SearchRuntime {
    public readonly searchPattern: ko.Observable<string>;
    public readonly results: ko.ObservableArray<SearchResult>;
    public readonly hasResults: ko.Observable<boolean>;

    constructor(private readonly searchService: SearchService) {
        this.searchPattern = ko.observable();
        this.results = ko.observableArray([]);
        this.hasResults = ko.observable(false);
    }

    @OnMounted()
    public async loadIndex(): Promise<void> {
        const searchString = this.getUrlParameter("q");
        this.searchPattern(searchString);

        this.searchPattern
            .extend(ChangeRateLimit)
            .subscribe(this.searchWebsite);
    }

    private getUrlParameter(name: string): string {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");

        const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        const results = regex.exec(location.search);

        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    private async searchWebsite(): Promise<void> {
        this.hasResults(false);
        this.results([]);

        const query = this.searchPattern().trim();
        const results = await this.searchService.search(query);

        this.results(results);
        this.hasResults(true);
    }
}
