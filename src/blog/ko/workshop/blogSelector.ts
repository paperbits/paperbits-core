import * as ko from "knockout";
import template from "./blogSelector.html";
import { IResourceSelector } from "@paperbits/common/ui/IResourceSelector";
import { BlogPostItem } from "./blogPostItem";
import { BlogPostContract } from '@paperbits/common/blogs/BlogPostContract';
import { IPermalinkService } from '@paperbits/common/permalinks';
import { IBlogService } from '@paperbits/common/blogs/IBlogService';
import { Component } from "@paperbits/knockout/decorators";

@Component({
    selector: "blog-selector",
    template: template,
    injectable: "blogSelector"
})
export class BlogSelector implements IResourceSelector<BlogPostContract> {
    private readonly blogService: IBlogService;
    private readonly permalinkService: IPermalinkService;

    public readonly searchPattern: KnockoutObservable<string>;
    public readonly posts: KnockoutObservableArray<BlogPostItem>;
    public readonly working: KnockoutObservable<boolean>;

    public selectedPost: KnockoutObservable<BlogPostItem>;
    public onResourceSelected: (blog: BlogPostContract) => void;

    constructor(blogService: IBlogService, permalinkService: IPermalinkService, onSelect: (blogPost: BlogPostContract) => void) {
        this.blogService = blogService;
        this.permalinkService = permalinkService;

        this.selectPost = this.selectPost.bind(this);
        this.onResourceSelected = onSelect;

        this.posts = ko.observableArray<BlogPostItem>();
        this.selectedPost = ko.observable<BlogPostItem>();
        this.searchPattern = ko.observable<string>();
        this.searchPattern.subscribe(this.searchPosts);
        this.working = ko.observable(true);

        // setting up...
        this.posts = ko.observableArray<BlogPostItem>();
        this.selectedPost = ko.observable<BlogPostItem>();
        this.searchPattern = ko.observable<string>();
        this.searchPattern.subscribe(this.searchPosts);
        this.working = ko.observable(true);

        this.searchPosts();
    }

    public async searchPosts(searchPattern: string = ""): Promise<void> {
        this.working(true);

        let blogs = await this.blogService.search(searchPattern);
        let blogItems = blogs.map(blog => new BlogPostItem(blog));
        this.posts(blogItems);
        this.working(false);
    }

    public async selectPost(blog: BlogPostItem): Promise<void> {
        this.selectedPost(blog);

        if (this.onResourceSelected) {
            this.onResourceSelected(blog.toBlogPost());
        }
    }
}