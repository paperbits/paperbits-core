import * as ko from "knockout";
import template from "./document.html";
import { IRouteHandler } from "@paperbits/common/routing";
import { IViewManager } from "@paperbits/common/ui";
import { Component } from "../ko/component";
import { LayoutModelBinder } from "../layout";
import { LayoutViewModelBinder } from "../layout/ko";
import { LayoutViewModel } from "../layout/ko/layoutViewModel";

@Component({
    selector: "page-document",
    template: template,
    injectable: "pageDocument"
})
export class DocumentViewModel {
    public readonly layoutModel: KnockoutObservable<LayoutViewModel>;
    public readonly disableTracking: KnockoutObservable<boolean>;

    constructor(
        private readonly layoutModelBinder: LayoutModelBinder,
        private readonly layoutViewModelBinder: LayoutViewModelBinder,
        private readonly routeHandler: IRouteHandler,
        private readonly viewManager: IViewManager
    ) {
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

        this.disableTracking(!layoutMode);
        this.viewManager.removeShutter();
    }

    private async onRouteChange(): Promise<void> {
        await this.refreshContent();
    }

    public dispose(): void {
        this.routeHandler.removeRouteChangeListener(this.onRouteChange);
    }
}