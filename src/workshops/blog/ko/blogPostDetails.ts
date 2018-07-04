import * as ko from "knockout";
import template from "./blogPostDetails.html";
import { IPermalink } from "@paperbits/common/permalinks";
import { IPermalinkService } from "@paperbits/common/permalinks";
import { IBlogService } from "@paperbits/common/blogs/IBlogService";
import { IRouteHandler } from "@paperbits/common/routing/IRouteHandler";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { Component } from "../../../ko/component";
import { BlogPostItem } from "./blogPostItem";

@Component({
    selector: "blog-post-details-workshop",
    template: template,
    injectable: "blogPostDetailsWorkshop"
})
export class BlogPostDetailsWorkshop {
    private blogPostPermalink: IPermalink;
    private readonly onDeleteCallback: () => void;

    public readonly blogPostItem: BlogPostItem;

    constructor(
        private readonly blogService: IBlogService,
        private readonly permalinkService: IPermalinkService,
        private readonly routeHandler: IRouteHandler,
        private readonly viewManager: IViewManager,
        params
    ) {
        // initialization...
        this.blogPostItem = params.blogPostItem;
        this.onDeleteCallback = params.onDeleteCallback;

        // rebinding...
        this.deleteBlogPost = this.deleteBlogPost.bind(this);
        this.updateBlogPost = this.updateBlogPost.bind(this);
        this.updatePermlaink = this.updatePermlaink.bind(this);

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

        this.init();
    }

    private async init(): Promise<void> {
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

        this.routeHandler.navigateTo(this.blogPostPermalink.uri, false);
    }

    public async deleteBlogPost(): Promise<void> {
        //TODO: Show confirmation dialog according to mockup
        await this.blogService.deleteBlogPost(this.blogPostItem.toBlogPost());

        this.viewManager.notifySuccess("Blog", `Post "${this.blogPostItem.title()}" was deleted.`);
        this.viewManager.closeWorkshop("blog-post-details-workshop");

        if (this.onDeleteCallback) {
            this.onDeleteCallback()
        }

        this.routeHandler.navigateTo("/");
    }
}