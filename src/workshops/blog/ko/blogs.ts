import * as ko from "knockout";
import template from "./blogs.html";
import { IBlogService } from "@paperbits/common/blogs/IBlogService";
import { IRouteHandler } from "@paperbits/common/routing/IRouteHandler";
import { IPermalinkService } from "@paperbits/common/permalinks";
import { IViewManager } from "@paperbits/common/ui";
import { IBlockService } from "@paperbits/common/blocks/IBlockService";
import { Keys } from "@paperbits/common/keyboard";
import { IFileService } from "@paperbits/common/files/IFileService";
import { Component } from "../../../ko/component";
import { BlogPostItem } from "./blogPostItem";

const templateBlockKey = "blocks/8730d297-af39-8166-83b6-9439addca789";

@Component({
    selector: "blogs",
    template: template,
    injectable: "blogWorkshop"
})
export class BlogWorkshop {
    private searchTimeout: any;

    public readonly searchPattern: KnockoutObservable<string>;
    public readonly blogPosts: KnockoutObservableArray<BlogPostItem>;
    public readonly working: KnockoutObservable<boolean>;
    public readonly selectedBlogPost: KnockoutObservable<BlogPostItem>;

    constructor(
        private readonly blogService: IBlogService,
        private readonly fileService: IFileService,
        private readonly permalinkService: IPermalinkService,
        private readonly routeHandler: IRouteHandler,
        private readonly blockService: IBlockService,
        private readonly viewManager: IViewManager
    ) {
        // initialization...
        this.blogService = blogService;
        this.fileService = fileService;
        this.permalinkService = permalinkService;
        this.routeHandler = routeHandler;
        this.viewManager = viewManager;

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

        let blogposts = await this.blogService.search(searchPattern);
        let blogpostItems = blogposts.map(blogPost => new BlogPostItem(blogPost));

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
        this.viewManager.openViewAsWorkshop("Blog post", "blog-post-details-workshop", {
            blogPostItem: blogPostItem,
            onDeleteCallback: () => {
                this.searchBlogPosts();
            }
        });
    }

    public async addBlogPost(): Promise<void> {
        this.working(true);

        const blogpost = await this.blogService.createBlogPost("New blog post", "", "");
        const createPermalinkPromise = this.permalinkService.createPermalink("/blog/new", blogpost.key);
        const contentTemplate = await this.blockService.getBlockByKey(templateBlockKey);

        const template = {
            "object": "block",
            "nodes": [contentTemplate.content],
            "type": "page"
        }

        const createContentPromise = this.fileService.createFile(template);
        
        const results = await Promise.all<any>([createPermalinkPromise, createContentPromise]);
        const permalink = results[0];
        const content = results[1];

        blogpost.permalinkKey = permalink.key;
        blogpost.contentKey = content.key;

        await this.blogService.updateBlogPost(blogpost);

        const blogPostItem = new BlogPostItem(blogpost);

        this.blogPosts.push(blogPostItem);
        this.selectBlogPost(blogPostItem);
        this.working(false);
    }

    public async deleteSelectedBlogPost(): Promise<void> {
        //TODO: Show confirmation dialog according to mockup
        await this.blogService.deleteBlogPost(this.selectedBlogPost().toBlogPost());

        this.routeHandler.navigateTo("/");
    }

    public keydown(item: BlogPostItem, event: KeyboardEvent): void {
        if (event.keyCode === Keys.Delete) {
            this.deleteSelectedBlogPost();
        }
    }
}