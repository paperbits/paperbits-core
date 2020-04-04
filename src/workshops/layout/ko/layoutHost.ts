import * as ko from "knockout";
import { ContentViewModelBinder, ContentViewModel } from "../../../content/ko";
import { Component, OnMounted, Param } from "@paperbits/common/ko/decorators";
import { Router } from "@paperbits/common/routing";
import { EventManager } from "@paperbits/common/events";
import { ViewManager, ViewManagerMode } from "@paperbits/common/ui";
import { ILayoutService } from "@paperbits/common/layouts";
import { Contract } from "@paperbits/common";
import { StyleManager, StyleCompiler } from "@paperbits/common/styles";


@Component({
    selector: "layout-host",
    template: "<!-- ko if: contentViewModel --><!-- ko widget: contentViewModel, grid: {} --><!-- /ko --><!-- /ko -->"
})
export class LayoutHost {
    public readonly contentViewModel: ko.Observable<ContentViewModel>;

    constructor(
        private readonly contentViewModelBinder: ContentViewModelBinder,
        private readonly router: Router,
        private readonly eventManager: EventManager,
        private readonly viewManager: ViewManager,
        private readonly layoutService: ILayoutService,
        private readonly styleCompiler: StyleCompiler
    ) {
        this.contentViewModel = ko.observable();
        this.layoutKey = ko.observable();
    }

    @Param()
    public layoutKey: ko.Observable<string>;

    @OnMounted()
    public async initialize(): Promise<void> {
        await this.refreshContent();

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
        const layoutContentContract = await this.layoutService.getLayoutContent(this.layoutKey());
        
        const styleManager = new StyleManager(this.eventManager);
        const styleSheet = await this.styleCompiler.getStyleSheet();
        styleManager.setStyleSheet(styleSheet);

        const bindingContext = {
            styleManager: styleManager,
            navigationPath: route.path,
            routeKind: "layout",
            template: {
                layout: {
                    value: layoutContentContract,
                    onValueUpdate: async (updatedContentContract: Contract) => {
                        await this.layoutService.updateLayoutContent(this.layoutKey(), updatedContentContract);
                    }
                }
            }
        };

        const contentViewModel = await this.contentViewModelBinder.getContentViewModelByKey(layoutContentContract, bindingContext);

        contentViewModel["widgetBinding"].provides = ["html", "js", "interaction"];

        this.contentViewModel(contentViewModel);
        this.viewManager.removeShutter();
    }
}