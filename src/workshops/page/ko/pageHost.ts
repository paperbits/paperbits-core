import * as ko from "knockout";
import { LayoutViewModelBinder, LayoutViewModel } from "../../../layout/ko";
import { Component, OnMounted } from "@paperbits/common/ko/decorators";
import { IRouteHandler } from "@paperbits/common/routing";
import { IEventManager } from "@paperbits/common/events";
import { IViewManager, ViewManagerMode } from "@paperbits/common/ui";


@Component({
    selector: "content-host",
    template: "<!-- ko if: layoutViewModel --><!-- ko widget: layoutViewModel, grid: {} --><!-- /ko --><!-- /ko -->",
    injectable: "pageHost"
})
export class PageHost {
    public readonly layoutViewModel: ko.Observable<LayoutViewModel>;

    constructor(
        private readonly layoutViewModelBinder: LayoutViewModelBinder,
        private readonly routeHandler: IRouteHandler,
        private readonly eventManager: IEventManager,
        private readonly viewManager: IViewManager
    ) {
        this.layoutViewModel = ko.observable();
        this.routeHandler.addRouteChangeListener(this.onRouteChange.bind(this));
        this.eventManager.addEventListener("onDataPush", () => this.onDataPush());
    }

    @OnMounted()
    public async initialize(): Promise<void> {
        this.refreshContent();
    }

    private async onDataPush(): Promise<void> {
        if (this.viewManager.mode === ViewManagerMode.selecting || this.viewManager.mode === ViewManagerMode.selected) {
            await this.refreshContent();
        }
    }

    private async refreshContent(): Promise<void> {
        const layoutViewModel = await this.layoutViewModelBinder.getLayoutViewModel();
        this.layoutViewModel(layoutViewModel);
    }

    private async onRouteChange(): Promise<void> {
        await this.refreshContent();
    }

    public dispose(): void {
        this.routeHandler.removeRouteChangeListener(this.onRouteChange);
    }
}