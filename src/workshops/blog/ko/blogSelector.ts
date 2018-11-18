import * as ko from "knockout";
import template from "./blogSelector.html";
import { IResourceSelector } from "@paperbits/common/ui";
import { BlogPostItem } from "./blogPostItem";
import { IBlogService, BlogPostContract } from "@paperbits/common/blogs";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";

@Component({
    selector: "blog-selector",
    template: template,
    injectable: "blogSelector"
})
export class BlogSelector implements IResourceSelector<BlogPostContract> {
    public readonly searchPattern: KnockoutObservable<string>;
    public readonly posts: KnockoutObservableArray<BlogPostItem>;
    public readonly working: KnockoutObservable<boolean>;

    @Param()
    public selectedPost: KnockoutObservable<BlogPostItem>;

    @Event()
    public onSelect: (blog: BlogPostContract) => void;

    constructor(private readonly blogService: IBlogService) {
        this.onMounted = this.onMounted.bind(this);
        this.selectPost = this.selectPost.bind(this);

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
    }

    @OnMounted()
    public async onMounted(): Promise<void> {
        this.searchPosts();
    }

    public async searchPosts(searchPattern: string = ""): Promise<void> {
        this.working(true);

        const blogs = await this.blogService.search(searchPattern);
        const blogItems = blogs.map(blog => new BlogPostItem(blog));
        this.posts(blogItems);
        this.working(false);
    }

    public async selectPost(blog: BlogPostItem): Promise<void> {
        this.selectedPost(blog);

        if (this.onSelect) {
            this.onSelect(blog.toBlogPost());
        }
    }
}