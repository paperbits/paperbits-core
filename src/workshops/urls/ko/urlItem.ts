import * as ko from "knockout";
import { UrlContract } from "@paperbits/common/urls/urlContract";

export class UrlItem {
    public key: string;
    public title: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;
    public permalink: KnockoutObservable<string>;
    public keywords: KnockoutObservable<string>;
    public hasFocus: KnockoutObservable<boolean>;

    constructor(url: UrlContract) {
        this.key = url.key;
        this.title = ko.observable<string>(url.title);
        this.description = ko.observable<string>(url.description);
        this.permalink = ko.observable<string>(url.permalink);
        this.hasFocus = ko.observable<boolean>(false);
    }

    public toUrl(): UrlContract {
        return {
            key: this.key,
            title: this.title(),
            description: this.description(),
            permalink: this.permalink()
        };
    }
}