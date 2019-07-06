import * as ko from "knockout";
import template from "./blogs.html";
import { IBlogService } from "@paperbits/common/blogs/IBlogService";
import { Router } from "@paperbits/common/routing";
import { IViewManager } from "@paperbits/common/ui";
import { Keys } from "@paperbits/common/keyboard";
import { Component } from "@paperbits/common/ko/decorators";
import { BlogPostItem } from "./blogPostItem";
import { LayoutViewModelBinder } from "../../../layout/ko";

@Component({
    selector: "blogs",
    template: template,
    injectable: "blogWorkshop"
})
export class BlogWorkshop {
    private searchTimeout: any;

    public readonly searchPattern: ko.Observable<string>;
    public readonly blogPosts: ko.ObservableArray<BlogPostItem>;
    public readonly working: ko.Observable<boolean>;
    public readonly selectedBlogPost: ko.Observable<BlogPostItem>;

    constructor(
        private readonly blogService: IBlogService,
        private readonly router: Router,
        private readonly viewManager: IViewManager,
        private readonly layoutViewModelBinder: LayoutViewModelBinder
    ) {
        // rebinding...
        this.searchBlogPosts = this.searchBlogPosts.bind(this);
        this.addBlogPost = this.addBlogPost.bind(this);
        this.selectBlogPost = this.selectBlogPost.bind(this);
        this.keydown = this.keydown.bind(this);

        // setting up...
        this.working = ko.observable(true);
        this.blogPosts = ko.observableArray<BlogPostItem>();
        this.selectedBlogPost = ko.observable<BlogPostItem>();
        this.searchPattern = ko.observable<string>("");
        this.searchPattern.subscribe(this.searchBlogPosts);
        this.searchBlogPosts("");
    }

    public async launchSearch(searchPattern: string): Promise<void> {
        this.working(true);

        const blogposts = await this.blogService.search(searchPattern);
        const blogpostItems = blogposts.map(blogPost => new BlogPostItem(blogPost));

        this.blogPosts(blogpostItems);

        this.working(false);
    }

    public async searchBlogPosts(searchPattern: string = ""): Promise<void> {
        clearTimeout(this.searchTimeout);

        this.searchTimeout = setTimeout(() => {
            this.launchSearch(searchPattern);
        }, 600);
    }

    public selectBlogPost(blogPostItem: BlogPostItem): void {
        this.selectedBlogPost(blogPostItem);
        this.viewManager.setHost({ name: "content-host" });
        this.viewManager.openViewAsWorkshop("Blog post", "blog-post-details-workshop", {
            blogPostItem: blogPostItem,
            onDeleteCallback: () => {
                this.searchBlogPosts();
            }
        });
    }

    public async addBlogPost(): Promise<void> {
        this.working(true);

        const postUrl = "/blog/new";
        const post = await this.blogService.createBlogPost(postUrl, "New blog post", "", "");
        const postItem = new BlogPostItem(post);

        this.blogPosts.push(postItem);
        this.selectBlogPost(postItem);

        this.router.navigateTo(postUrl, post.title);
        this.working(false);
    }

    public async deleteSelectedBlogPost(): Promise<void> {
        // TODO: Show confirmation dialog according to mockup
        await this.blogService.deleteBlogPost(this.selectedBlogPost().toBlogPost());

        this.router.navigateTo("/");
    }

    public keydown(item: BlogPostItem, event: KeyboardEvent): void {
        if (event.keyCode === Keys.Delete) {
            this.deleteSelectedBlogPost();
        }
    }
}