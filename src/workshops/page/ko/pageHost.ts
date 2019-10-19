import * as ko from "knockout";
import { LayoutViewModelBinder, LayoutViewModel } from "../../../layout/ko";
import { Component, OnMounted, OnDestroyed } from "@paperbits/common/ko/decorators";
import { Router, Route } from "@paperbits/common/routing";
import { EventManager } from "@paperbits/common/events";
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
        private readonly router: Router,
        private readonly eventManager: EventManager,
        private readonly viewManager: IViewManager
    ) {
        this.layoutViewModel = ko.observable();
        this.router.addRouteChangeListener(this.onRouteChange.bind(this));
        this.eventManager.addEventListener("onDataPush", () => this.onDataPush());
    }

    @OnMounted()
    public async initialize(): Promise<void> {
        this.refreshContent();
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
        const routeKind = route.metadata["routeKind"];
        const layoutViewModel = await this.layoutViewModelBinder.getLayoutViewModel(route.path, routeKind);
       
        this.layoutViewModel(layoutViewModel);
        this.viewManager.removeShutter();
    }

    private async onRouteChange(route: Route): Promise<void> {
        if (route.previous && route.previous.path === route.path && route.previous.metadata["routeKind"] === route.metadata["routeKind"]) {
            return;
        }

        await this.refreshContent();
    }

    @OnDestroyed()
    public dispose(): void {
        this.router.removeRouteChangeListener(this.onRouteChange);
    }
}