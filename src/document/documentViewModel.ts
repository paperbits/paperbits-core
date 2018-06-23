import * as ko from "knockout";
import template from "./document.html";
import * as Utils from "@paperbits/common/utils";
import { IRouteHandler } from "@paperbits/common/routing/IRouteHandler";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { Component } from "../ko/component";
import { LayoutModelBinder } from "../layout/layoutModelBinder";
import { LayoutViewModelBinder } from "../layout/ko/layoutViewModelBinder";
import { LayoutViewModel } from "../layout/ko/layoutViewModel";

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
    private readonly disposeBag: Utils.IFunctionBag = Utils.createFunctionBag();

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

        //this.layoutModel = ko.observable<IWidgetBinding>();
        this.layoutModel = ko.observable<LayoutViewModel>();
        this.disableTracking = ko.observable(false);

        this.refreshContent();
    }

    private async refreshContent(): Promise<void> {
        this.viewManager.setShutter();

        this.layoutModel(null);

        let layoutMode = this.viewManager.journeyName() == "Layouts";
        let readonly = !layoutMode;
        let layoutModel = await this.layoutModelBinder.getLayoutModel(this.routeHandler.getCurrentUrl(), readonly);
        let layoutViewModel = this.layoutViewModelBinder.modelToViewModel(layoutModel, readonly);

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
