import * as ko from "knockout";
import { PageContract } from "@paperbits/common/pages/pageContract";
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { SocialShareData } from "@paperbits/common/pages/socialShareData";

export class AnchorItem {
    public title: string;
    public shortTitle: string;
    public elementId: string;
    public isSelected: ko.Observable<boolean>;

    constructor() {
        this.isSelected = ko.observable<boolean>();
    }
}

export class PageItem {
    public key: string;
    public contentKey?: string;
    public readonly permalink: ko.Observable<string>;
    public readonly title: ko.Observable<string>;
    public readonly description: ko.Observable<string>;
    public readonly keywords: ko.Observable<string>;
    public readonly jsonLd: ko.Observable<string>;
    public readonly isSelected: ko.Observable<boolean>;
    public readonly socialShareData: ko.Observable<SocialShareData>;

    public anchors: ko.ObservableArray<AnchorItem>;
    public selectedAnchor?: AnchorItem;

    constructor(page: PageContract) {
        this.contentKey = page.contentKey;
        this.key = page.key;
        this.title = ko.observable<string>(page.title);
        this.description = ko.observable<string>(page.description);
        this.keywords = ko.observable<string>(page.keywords);
        this.jsonLd = ko.observable<string>(page.jsonLd);
        this.permalink = ko.observable<string>(page.permalink);
        this.isSelected = ko.observable<boolean>();
        this.anchors = ko.observableArray<AnchorItem>();
        this.socialShareData = ko.observable<SocialShareData>(page.socialShareData);
    }

    public getHyperlink(): HyperlinkModel {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = this.title();
        hyperlinkModel.targetKey = this.key;
        hyperlinkModel.href = this.permalink();
        
        if (this.selectedAnchor) {
            hyperlinkModel.anchor = this.selectedAnchor.elementId;
            hyperlinkModel.anchorName = this.selectedAnchor.shortTitle;
        }
        return hyperlinkModel;
    }

    public toContract(): PageContract {
        return {
            key: this.key,
            title: this.title(),
            description: this.description(),
            keywords: this.keywords(),
            jsonLd: this.jsonLd(),
            contentKey: this.contentKey,
            permalink: this.permalink(),
            socialShareData: this.socialShareData()
        };
    }
}