import * as ko from "knockout";
import template from "./blogPostDetails.html";
import { IPermalink, IPermalinkService } from "@paperbits/common/permalinks";
import { IBlogService } from "@paperbits/common/blogs/IBlogService";
import { IRouteHandler } from "@paperbits/common/routing/IRouteHandler";
import { IViewManager } from "@paperbits/common/ui";
import { Component, Param, Event, OnMounted } from "../../../ko/decorators";
import { BlogPostItem } from "./blogPostItem";

@Component({
    selector: "blog-post-details-workshop",
    template: template,
    injectable: "blogPostDetailsWorkshop"
})
export class BlogPostDetailsWorkshop {
    private blogPostPermalink: IPermalink;

    @Param()
    public readonly blogPostItem: BlogPostItem;

    @Event()
    public readonly onDeleteCallback: () => void;

    constructor(
        private readonly blogService: IBlogService,
        private readonly permalinkService: IPermalinkService,
        private readonly routeHandler: IRouteHandler,
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
            .extend({ required: true })
            .subscribe(this.updateBlogPost);

        this.blogPostItem.description
            .subscribe(this.updateBlogPost);

        this.blogPostItem.keywords
            .subscribe(this.updateBlogPost);

        this.blogPostItem.permalinkUrl
            .extend({ uniquePermalink: this.blogPostItem.permalinkKey, required: true, onlyValid: true })
            .subscribe(this.updatePermlaink);

        const permalink = await this.permalinkService.getPermalinkByKey(this.blogPostItem.permalinkKey);

        this.blogPostPermalink = permalink;
        this.blogPostItem.permalinkUrl(permalink.uri);
        this.routeHandler.navigateTo(permalink.uri);
    }

    private async updateBlogPost(): Promise<void> {
        if (this.blogPostItem.title.isValid()) {
            await this.blogService.updateBlogPost(this.blogPostItem.toBlogPost());
        }
    }

    private async updatePermlaink(): Promise<void> {
        this.blogPostPermalink.uri = this.blogPostItem.permalinkUrl();
        await this.permalinkService.updatePermalink(this.blogPostPermalink);

        this.routeHandler.notifyListeners = false;
        this.routeHandler.navigateTo(this.blogPostPermalink.uri);
        this.routeHandler.notifyListeners = true;
    }

    public async deleteBlogPost(): Promise<void> {
        // TODO: Show confirmation dialog according to mockup
        await this.blogService.deleteBlogPost(this.blogPostItem.toBlogPost());

        this.viewManager.notifySuccess("Blog", `Post "${this.blogPostItem.title()}" was deleted.`);
        this.viewManager.closeWorkshop("blog-post-details-workshop");

        if (this.onDeleteCallback) {
            this.onDeleteCallback()
        }

        this.routeHandler.navigateTo("/");
    }
}