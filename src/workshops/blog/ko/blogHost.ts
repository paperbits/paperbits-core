import * as ko from "knockout";
import { Component, OnMounted, OnDestroyed, Param } from "@paperbits/common/ko/decorators";
import { Router, Route } from "@paperbits/common/routing";
import { EventManager } from "@paperbits/common/events";
import { ViewManager, ViewManagerMode } from "@paperbits/common/ui";
import { ContentViewModelBinder, ContentViewModel } from "../../../content/ko";
import { ILayoutService } from "@paperbits/common/layouts";
import { IBlogService } from "@paperbits/common/blogs";
import { Contract } from "@paperbits/common";


@Component({
    selector: "blog-post-host",
    template: "<!-- ko if: contentViewModel --><!-- ko widget: contentViewModel, grid: {} --><!-- /ko --><!-- /ko -->"
})
export class BlogHost {
    public readonly contentViewModel: ko.Observable<ContentViewModel>;

    constructor(
        private readonly contentViewModelBinder: ContentViewModelBinder,
        private readonly router: Router,
        private readonly eventManager: EventManager,
        private readonly viewManager: ViewManager,
        private readonly layoutService: ILayoutService,
        private readonly blogService: IBlogService
    ) {
        this.contentViewModel = ko.observable();
        this.blogPostKey = ko.observable();
    }

    @Param()
    public blogPostKey: ko.Observable<string>;

    @OnMounted()
    public async initialize(): Promise<void> {
        await this.refreshContent();

        this.router.addRouteChangeListener(this.onRouteChange);
        this.eventManager.addEventListener("onDataPush", () => this.onDataPush());
    }

    /**
     * This event occurs when data gets pushed to the storage. For example, "Undo" command restores the previous state.
     */
    private async onDataPush(): Promise<void> {
        if (this.viewManager.mode === ViewManagerMode.selecting || this.viewManager.mode === ViewManagerMode.selected) {
            await this.refreshContent();
        }
    }

    private async refreshContent(): Promise<void> {
        this.viewManager.setShutter();

        const route = this.router.getCurrentRoute();
        const postContract = await this.blogService.getBlogPostByPermalink(route.path);
        const postContentContract = await this.blogService.getBlogPostContent(postContract.key);

        this.blogPostKey(postContract.key);

        const bindingContext = {
            navigationPath: route.path,
            contentType: "blog-post",
            template: {
                page: {
                    value: postContentContract,
                    onValueUpdate: async (updatedPostContract: Contract) => {
                        await this.blogService.updateBlogPostContent(postContract.key, updatedPostContract);
                    }
                }
            }
        };

        const layoutContract = await this.layoutService.getLayoutByPermalink(route.path);

        if (!layoutContract) {
            throw new Error(`No matching layouts found for page with permalink "${route.path}".`);
        }

        const layoutContentContract = await this.layoutService.getLayoutContent(layoutContract.key);
        const contentViewModel = await this.contentViewModelBinder.contractToViewModel(layoutContentContract, bindingContext);

        this.contentViewModel(contentViewModel);

        this.viewManager.removeShutter();
    }

    private async onRouteChange(route: Route): Promise<void> {
        if (route.previous && route.previous.path === route.path) {
            return;
        }

        await this.refreshContent();
    }

    @OnDestroyed()
    public dispose(): void {
        this.router.removeRouteChangeListener(this.onRouteChange);
    }
}