import template from "./blogPostDetails.html";
import { IBlogService } from "@paperbits/common/blogs/IBlogService";
import { RouteHandler } from "@paperbits/common/routing/RouteHandler";
import { IViewManager } from "@paperbits/common/ui";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { BlogPostItem } from "./blogPostItem";

@Component({
    selector: "blog-post-details-workshop",
    template: template,
    injectable: "blogPostDetailsWorkshop"
})
export class BlogPostDetailsWorkshop {
    @Param()
    public readonly blogPostItem: BlogPostItem;

    @Event()
    public readonly onDeleteCallback: () => void;

    constructor(
        private readonly blogService: IBlogService,
        private readonly routeHandler: RouteHandler,
        private readonly viewManager: IViewManager
    ) {
        // rebinding...
        this.onMounted = this.onMounted.bind(this);
        this.deleteBlogPost = this.deleteBlogPost.bind(this);
        this.updateBlogPost = this.updateBlogPost.bind(this);
        this.updatePermlaink = this.updatePermlaink.bind(this);
    }

    @OnMounted()
    public async onMounted(): Promise<void> {
        this.blogPostItem.title
            .extend(<any>{ required: true })
            .subscribe(this.updateBlogPost);

        this.blogPostItem.description
            .subscribe(this.updateBlogPost);

        this.blogPostItem.keywords
            .subscribe(this.updateBlogPost);

        this.blogPostItem.permalink
            .extend(<any>{ uniquePermalink: this.blogPostItem.permalink, required: true, onlyValid: true })
            .subscribe(this.updatePermlaink);

        const blogPost = await this.blogService.getBlogPostByKey(this.blogPostItem.key);

        this.blogPostItem.permalink(blogPost.permalink);
        this.routeHandler.navigateTo(blogPost.permalink, blogPost.title);
    }

    private async updateBlogPost(): Promise<void> {
        if ((<any>this.blogPostItem.title).isValid()) {
            await this.blogService.updateBlogPost(this.blogPostItem.toBlogPost());
        }
    }

    private async updatePermlaink(): Promise<void> {
        const permalink = this.blogPostItem.permalink();
        this.routeHandler.notifyListeners = false;
        // this.routeHandler.navigateTo(permalink);
        this.routeHandler.notifyListeners = true;

        this.updateBlogPost();
    }

    public async deleteBlogPost(): Promise<void> {
        // TODO: Show confirmation dialog according to mockup
        await this.blogService.deleteBlogPost(this.blogPostItem.toBlogPost());

        this.viewManager.notifySuccess("Blog", `Post "${this.blogPostItem.title()}" was deleted.`);
        this.viewManager.closeWorkshop("blog-post-details-workshop");

        if (this.onDeleteCallback) {
            this.onDeleteCallback();
        }

        this.routeHandler.navigateTo("/");
    }
}