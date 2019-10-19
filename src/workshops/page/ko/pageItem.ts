import * as ko from "knockout";
import { PageContract } from "@paperbits/common/pages/pageContract";
import { HyperlinkModel } from "@paperbits/common/permalinks";

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
    public permalink: ko.Observable<string>;
    public title: ko.Observable<string>;
    public description: ko.Observable<string>;
    public keywords: ko.Observable<string>;
    public isSelected: ko.Observable<boolean>;

    public anchors: ko.ObservableArray<AnchorItem>;
    public selectedAnchor?: AnchorItem;

    constructor(page: PageContract) {
        this.contentKey = page.contentKey;
        this.key = page.key;
        this.title = ko.observable<string>(page.title);
        this.description = ko.observable<string>(page.description);
        this.keywords = ko.observable<string>(page.keywords);
        this.permalink = ko.observable<string>(page.permalink);
        this.isSelected = ko.observable<boolean>();
        this.anchors = ko.observableArray<AnchorItem>();
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
            contentKey: this.contentKey,
            permalink: this.permalink()
        };
    }
}