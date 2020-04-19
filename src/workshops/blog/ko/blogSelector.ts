import * as ko from "knockout";
import template from "./blogSelector.html";
import { IResourceSelector } from "@paperbits/common/ui";
import { BlogPostItem } from "./blogPostItem";
import { IBlogService, BlogPostContract } from "@paperbits/common/blogs";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";
import { HyperlinkModel } from "@paperbits/common/permalinks";

@Component({
    selector: "blog-selector",
    template: template
})
export class BlogSelector implements IResourceSelector<BlogPostContract> {
    public readonly searchPattern: ko.Observable<string>;
    public readonly posts: ko.ObservableArray<BlogPostItem>;
    public readonly working: ko.Observable<boolean>;

    constructor(private readonly blogService: IBlogService) {
        this.posts = ko.observableArray();
        this.selectedPost = ko.observable();
        this.searchPattern = ko.observable();
        this.working = ko.observable();
        this.posts = ko.observableArray();
        this.searchPattern = ko.observable();
        this.working = ko.observable();
    }

    @Param()
    public selectedPost: ko.Observable<BlogPostItem>;

    @Event()
    public onSelect: (blog: BlogPostContract) => void;

    @Event()
    public onHyperlinkSelect: (selection: HyperlinkModel) => void;

    @OnMounted()
    public async onMounted(): Promise<void> {
        await this.searchPosts();

        this.searchPattern
            .extend(ChangeRateLimit)
            .subscribe(this.searchPosts);
    }

    public async searchPosts(searchPattern: string = ""): Promise<void> {
        this.working(true);

        const blogs = await this.blogService.search(searchPattern);
        const blogItems = blogs.map(blog => new BlogPostItem(blog));
        this.posts(blogItems);

        this.working(false);
    }

    public async selectPost(blogPost: BlogPostItem): Promise<void> {
        this.selectedPost(blogPost);

        if (this.onSelect) {
            this.onSelect(blogPost.toBlogPost());
        }

        if (this.onHyperlinkSelect) {
            this.onHyperlinkSelect(blogPost.getHyperlink());
        }
    }
}