import * as ko from "knockout";
import { Component, OnMounted, OnDestroyed, Param } from "@paperbits/common/ko/decorators";
import { Router, Route } from "@paperbits/common/routing";
import { EventManager } from "@paperbits/common/events";
import { ViewManager, ViewManagerMode } from "@paperbits/common/ui";
import { ContentViewModelBinder, ContentViewModel } from "../../../content/ko";
import { ILayoutService } from "@paperbits/common/layouts";
import { IPageService } from "@paperbits/common/pages";
import { Contract } from "@paperbits/common";
import { StyleCompiler, StyleManager } from "@paperbits/common/styles";


@Component({
    selector: "page-host",
    template: "<!-- ko if: contentViewModel --><!-- ko widget: contentViewModel, grid: {} --><!-- /ko --><!-- /ko -->"
})
export class PageHost {
    public readonly contentViewModel: ko.Observable<ContentViewModel>;

    constructor(
        private readonly contentViewModelBinder: ContentViewModelBinder,
        private readonly router: Router,
        private readonly eventManager: EventManager,
        private readonly viewManager: ViewManager,
        private readonly layoutService: ILayoutService,
        private readonly pageService: IPageService,
        private readonly styleCompiler: StyleCompiler
    ) {
        this.contentViewModel = ko.observable();
        this.pageKey = ko.observable();
    }

    @Param()
    public pageKey: ko.Observable<string>;

    @OnMounted()
    public async initialize(): Promise<void> {
        await this.refreshContent();

        this.router.addRouteChangeListener(this.onRouteChange);
        this.eventManager.addEventListener("onDataPush", () => this.onDataPush());
        this.eventManager.addEventListener("onLocaleChange", () => this.onLocaleUpdate());
    }

    /**
     * This event occurs when data gets pushed to the storage. For example, "Undo" command restores the previous state.
     */
    private async onDataPush(): Promise<void> {
        if (this.viewManager.mode === ViewManagerMode.selecting || this.viewManager.mode === ViewManagerMode.selected) {
            await this.refreshContent();
        }
    }

    private async onLocaleUpdate(): Promise<void> {
        await this.refreshContent();
    }

    private async refreshContent(): Promise<void> {
        this.viewManager.setShutter();

        const route = this.router.getCurrentRoute();
        let pageContract = await this.pageService.getPageByPermalink(route.path);

        if (!pageContract) {
            pageContract = await this.pageService.getPageByPermalink("/404");

            if (!pageContract) {
                this.viewManager.removeShutter();
                return;
            }
        }

        const pageContentContract = await this.pageService.getPageContent(pageContract.key);

        this.pageKey(pageContract.key);

        const styleManager = new StyleManager(this.eventManager);
        const styleSheet = await this.styleCompiler.getStyleSheet();
        styleManager.setStyleSheet(styleSheet);

        const bindingContext = {
            contentItemKey: pageContract.key,
            styleManager: styleManager,
            navigationPath: route.path,
            routeKind: "page",
            template: {
                page: {
                    value: pageContentContract,
                    onValueUpdate: async (updatedPostContract: Contract) => {
                        await this.pageService.updatePageContent(pageContract.key, updatedPostContract);
                    }
                }
            }
        };

        const layoutContract = await this.layoutService.getLayoutByPermalink(route.path);

        if (!layoutContract) {
            throw new Error(`No matching layouts found for page with permalink "${route.path}".`);
        }

        const layoutContentContract = await this.layoutService.getLayoutContent(layoutContract.key);
        const contentViewModel = await this.contentViewModelBinder.getContentViewModelByKey(layoutContentContract, bindingContext);

        contentViewModel["widgetBinding"].provides = ["html", "js", "interaction"];

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