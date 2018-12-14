import * as ko from "knockout";
import { BlogPostContract } from "@paperbits/common/blogs";

export class BlogPostItem {
    private contentKey?: string;

    public key: string;
    public permalink: KnockoutObservable<string>;
    public title: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;
    public keywords: KnockoutObservable<string>;
    public hasFocus: KnockoutObservable<boolean>;

    constructor(blogPost: BlogPostContract) {
        this.contentKey = blogPost.contentKey;

        this.key = blogPost.key;
        this.permalink = ko.observable<string>();
        this.title = ko.observable<string>(blogPost.title);
        this.description = ko.observable<string>(blogPost.description);
        this.keywords = ko.observable<string>(blogPost.keywords);
        this.hasFocus = ko.observable<boolean>(false);
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