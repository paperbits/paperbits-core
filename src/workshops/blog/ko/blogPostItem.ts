import * as ko from "knockout";
import { BlogPostContract } from "@paperbits/common/blogs";
import { HyperlinkModel } from "@paperbits/common/permalinks";

export class BlogPostItem {
    private contentKey?: string;

    public key: string;
    public permalink: ko.Observable<string>;
    public title: ko.Observable<string>;
    public description: ko.Observable<string>;
    public keywords: ko.Observable<string>;
    public hasFocus: ko.Observable<boolean>;

    constructor(blogPost: BlogPostContract) {
        this.contentKey = blogPost.contentKey;
        this.key = blogPost.key;
        this.title = ko.observable<string>(blogPost.title);
        this.description = ko.observable<string>(blogPost.description);
        this.keywords = ko.observable<string>(blogPost.keywords);
        this.permalink = ko.observable<string>(blogPost.permalink);
        this.hasFocus = ko.observable<boolean>(false);
    }

    public getHyperlink(): HyperlinkModel {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = this.title();
        hyperlinkModel.targetKey = this.key;
        hyperlinkModel.href = this.permalink();
        
        // if (this.selectedAnchor) {
        //     hyperlinkModel.anchor = this.selectedAnchor.elementId;
        //     hyperlinkModel.anchorName = this.selectedAnchor.shortTitle;
        // }

        return hyperlinkModel;
    }

    public toBlogPost(): BlogPostContract {
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