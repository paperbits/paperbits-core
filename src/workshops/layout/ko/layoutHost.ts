import * as ko from "knockout";
import { LayoutViewModelBinder, LayoutViewModel } from "../../../layout/ko";
import { Component, OnMounted, OnDestroyed, Param } from "@paperbits/common/ko/decorators";
import { Router, Route } from "@paperbits/common/routing";
import { EventManager } from "@paperbits/common/events";
import { ViewManager, ViewManagerMode } from "@paperbits/common/ui";


@Component({
    selector: "layout-host",
    template: "<!-- ko if: layoutViewModel --><!-- ko widget: layoutViewModel, grid: {} --><!-- /ko --><!-- /ko -->"
})
export class LayoutHost {
    public readonly layoutViewModel: ko.Observable<LayoutViewModel>;

    constructor(
        private readonly layoutViewModelBinder: LayoutViewModelBinder,
        private readonly router: Router,
        private readonly eventManager: EventManager,
        private readonly viewManager: ViewManager
    ) {
        this.layoutViewModel = ko.observable();
        this.layoutKey = ko.observable();
    }

    @Param()
    public layoutKey: ko.Observable<string>;

    @OnMounted()
    public async initialize(): Promise<void> {
        await this.refreshContent();

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

        const layoutViewModel = await this.layoutViewModelBinder.getLayoutViewModelByKey(route.path, this.layoutKey());
       
        this.layoutViewModel(layoutViewModel);
        this.viewManager.removeShutter();
    }
}