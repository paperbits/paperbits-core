import * as ko from "knockout";
import { PageContract } from "@paperbits/common/pages/pageContract";

export class AnchorItem {
    public hasFocus: KnockoutObservable<boolean>;
    public title: string;
    public shortTitle: string;
    public permalinkKey: string;
    public pagePermalinkKey: string;

    constructor() {
        this.hasFocus = ko.observable<boolean>(false);
    }

    public toContract(): any {
        return {
            title: this.title,
            permalinkKey: this.permalinkKey
        }
    }
}

export class PageItem {
    contentKey?: string;
    permalinkKey?: string;

    public key: string;
    public permalinkUrl: KnockoutObservable<string>;
    public title: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;
    public keywords: KnockoutObservable<string>;
    public hasFocus: KnockoutObservable<boolean>;

    public anchors: AnchorItem[];

    constructor(page: PageContract) {
        this.contentKey = page.contentKey;
        this.permalinkKey = page.permalinkKey;
        this.key = page.key;

        this.permalinkUrl = ko.observable<string>();
        this.title = ko.observable<string>(page.title);
        this.description = ko.observable<string>(page.description);
        this.keywords = ko.observable<string>(page.keywords);
        this.hasFocus = ko.observable<boolean>(false);
        this.anchors = [];

        if (page.anchors) {
            Object.keys(page.anchors).forEach(key => {
                const anchorItem = new AnchorItem();
                anchorItem.title = `${page.title} > ${page.anchors[key]}`;
                anchorItem.shortTitle = page.anchors[key];
                anchorItem.permalinkKey = key.replaceAll("|", "/");
                this.anchors.push(anchorItem);
            })
        }
    }

    toContract(): PageContract {
        return {
            key: this.key,
            title: this.title(),
            description: this.description(),
            keywords: this.keywords(),
            contentKey: this.contentKey,
            permalinkKey: this.permalinkKey
        }
    }
}