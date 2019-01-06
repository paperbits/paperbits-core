import * as ko from "knockout";
import { LayoutViewModelBinder, LayoutViewModel } from "../../../layout/ko";
import { Component, OnMounted, OnDestroyed } from "@paperbits/common/ko/decorators";
import { IRouteHandler } from "@paperbits/common/routing";


@Component({
    selector: "page-host",
    template: "<!-- ko if: layoutViewModel --><!-- ko widget: layoutViewModel, grid: {} --><!-- /ko --><!-- /ko -->",
    injectable: "pageHost"
})
export class PageHost {
    public layoutViewModel: KnockoutObservable<LayoutViewModel>;

    constructor(
        private readonly layoutViewModelBinder: LayoutViewModelBinder,
        private readonly routeHandler: IRouteHandler
    ) {
        this.initialize = this.initialize.bind(this);
        this.dispose = this.dispose.bind(this);
        this.onRouteChange = this.onRouteChange.bind(this);
        
        this.layoutViewModel = ko.observable();
        this.routeHandler.addRouteChangeListener(this.onRouteChange);
    }

    @OnMounted()
    public async initialize(): Promise<void> {
        this.refreshContent();
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