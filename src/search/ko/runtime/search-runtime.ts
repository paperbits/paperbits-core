import * as lunr from "lunr";
import * as ko from "knockout";
import template from "./search-runtime.html";
import { stripHtml } from "@paperbits/common/utils";
import { HttpClient } from "@paperbits/common/http";
import { Component, RuntimeComponent, OnMounted } from "@paperbits/common/ko/decorators";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";


export interface SearchResult {
    title: string;
    fragment: string;
    url: string;
}

@RuntimeComponent({ selector: "search-runtime" })
@Component({
    selector: "search-runtime",
    template: template
})
export class SearchRuntime {
    private index: lunr.Index;

    public readonly searchPattern: ko.Observable<string>;
    public readonly results: ko.ObservableArray<SearchResult>;
    public readonly hasResults: ko.Observable<boolean>;

    constructor(private readonly httpClient: HttpClient) {
        this.searchPattern = ko.observable();
        this.results = ko.observableArray([]);
        this.hasResults = ko.observable(false);
    }

    @OnMounted()
    public async loadIndex(): Promise<void> {
        const searchString = this.getUrlParameter("q");
        this.searchPattern(searchString);

        try {
            const response = await this.httpClient.send({ url: "/search-index.json", method: "GET" });

            if (response.statusCode !== 200) {
                return;
            }

            const indexData: any = response.toObject();

            this.index = lunr.Index.load(indexData);

            this.searchPattern
                .extend(ChangeRateLimit)
                .subscribe(this.searchWebsite);
        }
        catch (error) {
            console.log(error);
        }
    }

    private getUrlParameter(name: string): string {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");

        const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        const results = regex.exec(location.search);

        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    private searchWebsite(): void {
        this.hasResults(false);
        this.results([]);

        const query = this.searchPattern().trim();
        const searchRawResults = this.index.search(query);

        searchRawResults.slice(0, 5).forEach(async result => {
            const searchTerm = Object.keys(result.matchData.metadata)[0];
            const search = await this.fetchResults(searchTerm, result.ref);

            this.results.push(search);
        });

        this.hasResults(true);
    }

    private async fetchResults(term: string, url: string): Promise<SearchResult> {
        const response = await this.httpClient.send({
            url: url,
            method: "GET"
        });

        const text = response.toText();
        const parser = new DOMParser();
        const searchedDocument: Document = parser.parseFromString(text, "text/html");
        const title = searchedDocument.title;
        const body = stripHtml(searchedDocument.body.innerHTML);
        const fragmentSize = 150;
        const index = body.toLowerCase().indexOf(term.toLowerCase());

        let startIndex = index - Math.floor(fragmentSize / 2);

        if (startIndex < 0) {
            startIndex = 0;
        }

        const fragment = `...${body.substring(startIndex, startIndex + fragmentSize)}...`;

        return {
            title: title,
            fragment: fragment,
            url: url
        };
    }
}