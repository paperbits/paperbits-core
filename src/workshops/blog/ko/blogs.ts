import * as ko from "knockout";
import template from "./blogs.html";
import { IBlogService } from "@paperbits/common/blogs";
import { Router } from "@paperbits/common/routing";
import { ViewManager, View } from "@paperbits/common/ui";
import { Keys } from "@paperbits/common/keyboard";
import { Component, OnMounted } from "@paperbits/common/ko/decorators";
import { BlogPostItem } from "./blogPostItem";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";

@Component({
    selector: "blogs",
    template: template,
    injectable: "blogWorkshop"
})
export class BlogWorkshop {
    public readonly searchPattern: ko.Observable<string>;
    public readonly blogPosts: ko.ObservableArray<BlogPostItem>;
    public readonly working: ko.Observable<boolean>;
    public readonly selectedBlogPost: ko.Observable<BlogPostItem>;

    constructor(
        private readonly blogService: IBlogService,
        private readonly router: Router,
        private readonly viewManager: ViewManager,
    ) {
        this.blogPosts = ko.observableArray();
        this.selectedBlogPost = ko.observable();
        this.searchPattern = ko.observable<string>("");
        this.working = ko.observable();
    }

    @OnMounted()
    public async initialize(): Promise<void> {
        await this.searchPosts();

        this.searchPattern
            .extend(ChangeRateLimit)
            .subscribe(this.searchPosts);
    }

    public async searchPosts(searchPattern: string = ""): Promise<void> {
        this.working(true);

        const blogposts = await this.blogService.search(searchPattern);
        const blogpostItems = blogposts.map(blogPost => new BlogPostItem(blogPost));

        this.blogPosts(blogpostItems);

        this.working(false);
    }

    public selectBlogPost(blogPostItem: BlogPostItem): void {
        this.selectedBlogPost(blogPostItem);
        this.viewManager.setHost({ name: "page-host" });

        const view: View = {
            heading: "Blog post",
            component: {
                name: "blog-post-details-workshop",
                params: {
                    pageItem: blogPostItem,
                    onDeleteCallback: () => {
                        this.searchPosts();
                    }
                }
            }
        };

        this.viewManager.openViewAsWorkshop(view);
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