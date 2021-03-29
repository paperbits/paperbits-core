import * as ko from "knockout";
import { UrlContract } from "@paperbits/common/urls/urlContract";
import { HyperlinkModel } from "@paperbits/common/permalinks";

/**
 * URL view model.
 */
export class UrlItem {
    public key: string;
    public title: ko.Observable<string>;
    public description: ko.Observable<string>;
    public permalink: ko.Observable<string>;
    public keywords: ko.Observable<string>;
    public hasFocus: ko.Observable<boolean>;

    constructor(url: UrlContract) {
        this.key = url.key;
        this.title = ko.observable<string>(url.title);
        this.description = ko.observable<string>(url.description);
        this.permalink = ko.observable<string>(url.permalink);
        this.hasFocus = ko.observable<boolean>(false);
    }

    public toContract(): UrlContract {
        return {
            key: this.key,
            title: this.title(),
            description: this.description(),
            permalink: this.permalink()
        };
    }

    public getHyperlink(): HyperlinkModel {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = this.title();
        hyperlinkModel.target = "_self";
        hyperlinkModel.targetKey = this.key;
        hyperlinkModel.href = this.permalink();

        return hyperlinkModel;
    }
}