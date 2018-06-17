import * as ko from "knockout";
import { BlogPostContract } from '@paperbits/common/blogs/BlogPostContract';

export class BlogPostItem {
    contentKey?: string;
    permalinkKey?: string;

    public key: string;
    public permalinkUrl: KnockoutObservable<string>;
    public title: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;
    public keywords: KnockoutObservable<string>;
    public hasFocus: KnockoutObservable<boolean>;

    constructor(blogPost: BlogPostContract) {
        this.contentKey = blogPost.contentKey;
        this.permalinkKey = blogPost.permalinkKey;

        this.key = blogPost.key;
        this.permalinkUrl = ko.observable<string>();
        this.title = ko.observable<string>(blogPost.title);
        this.description = ko.observable<string>(blogPost.description);
        this.keywords = ko.observable<string>(blogPost.keywords);
        this.hasFocus = ko.observable<boolean>(false);
    }

    toBlogPost(): BlogPostContract {
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