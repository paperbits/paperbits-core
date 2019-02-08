import * as ko from "knockout";
import { PageContract } from "@paperbits/common/pages/pageContract";

export class AnchorItem {
    public hasFocus: ko.Observable<boolean>;
    public title: string;
    public shortTitle: string;

    constructor() {
        this.hasFocus = ko.observable<boolean>(false);
    }
}

export class PageItem {
    public key: string;
    public contentKey?: string;
    public permalink: ko.Observable<string>;
    public title: ko.Observable<string>;
    public description: ko.Observable<string>;
    public keywords: ko.Observable<string>;
    public hasFocus: ko.Observable<boolean>;

    public anchors: AnchorItem[];

    constructor(page: PageContract) {
        this.contentKey = page.contentKey;
        this.key = page.key;
        this.title = ko.observable<string>(page.title);
        this.description = ko.observable<string>(page.description);
        this.keywords = ko.observable<string>(page.keywords);
        this.permalink = ko.observable<string>(page.permalink);
        this.hasFocus = ko.observable<boolean>(false);
    }

    public toContract(): PageContract {
        return {
            key: this.key,
            title: this.title(),
            description: this.description(),
            keywords: this.keywords(),
            contentKey: this.contentKey,
            permalink: this.permalink()
        };
    }
}