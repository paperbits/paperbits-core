import * as ko from "knockout";
import template from "./document.html";
import { IRouteHandler } from "@paperbits/common/routing";
import { IViewManager } from "@paperbits/common/ui";
import { Component } from "../ko/component";
import { LayoutModelBinder } from "../layout";
import { LayoutViewModelBinder, LayoutViewModel } from "../layout/ko";

@Component({
    selector: "paperbits-document",
    template: template,
    injectable: "docWidget"
})
export class DocumentViewModel {
    private readonly layoutModelBinder: LayoutModelBinder;
    private readonly layoutViewModelBinder: LayoutViewModelBinder;
    private readonly routeHandler: IRouteHandler;
    private readonly viewManager: IViewManager;

    public readonly layoutModel: KnockoutObservable<LayoutViewModel>;
    public readonly disableTracking: KnockoutObservable<boolean>;

    constructor(layoutModelBinder: LayoutModelBinder, layoutViewModelBinder: LayoutViewModelBinder, routeHandler: IRouteHandler, viewManager: IViewManager) {
        // initialization...
        this.layoutModelBinder = layoutModelBinder;
        this.layoutViewModelBinder = layoutViewModelBinder;
        this.routeHandler = routeHandler;
        this.viewManager = viewManager;

        // rebinding...
        this.refreshContent = this.refreshContent.bind(this);
        this.onRouteChange = this.onRouteChange.bind(this);

        // setting up...
        this.routeHandler.addRouteChangeListener(this.onRouteChange);

        this.layoutModel = ko.observable<LayoutViewModel>();
        this.disableTracking = ko.observable(false);

        this.refreshContent();
    }

    private async refreshContent(): Promise<void> {
        this.viewManager.setShutter();

        this.layoutModel(null);

        const layoutMode = this.viewManager.journeyName() === "Layouts";
        const readonly = !layoutMode;
        const layoutModel = await this.layoutModelBinder.getLayoutModel(this.routeHandler.getCurrentUrl(), readonly);
        const layoutViewModel = this.layoutViewModelBinder.modelToViewModel(layoutModel, readonly);

        this.layoutModel(layoutViewModel);

        this.disableTracking(!layoutMode)
        this.viewManager.removeShutter();
    }

    private async onRouteChange(): Promise<void> {
        await this.refreshContent();
    }

    public dispose(): void {
        this.routeHandler.removeRouteChangeListener(this.onRouteChange);
    }
}
