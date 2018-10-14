import * as ko from "knockout";
import template from "./document.html";
import { IRouteHandler } from "@paperbits/common/routing";
import { Component, OnMounted } from "../ko/decorators";
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

    constructor(
        private readonly layoutModelBinder: LayoutModelBinder,
        private readonly layoutViewModelBinder: LayoutViewModelBinder,
        private readonly routeHandler: IRouteHandler
    ) {
        // rebinding...
        this.onMounted = this.onMounted.bind(this);
        this.refreshContent = this.refreshContent.bind(this);
        this.onRouteChange = this.onRouteChange.bind(this);

        // setting up...
        this.routeHandler.addRouteChangeListener(this.onRouteChange);

        this.layoutModel = ko.observable<LayoutViewModel>();
    }

    @OnMounted()
    public async onMounted(): Promise<void> {
        this.refreshContent();
    }

    private async refreshContent(): Promise<void> {
        this.layoutModel(null);

        const layoutModel = await this.layoutModelBinder.getLayoutModel();
        const layoutViewModel = this.layoutViewModelBinder.modelToViewModel(layoutModel);

        this.layoutModel(layoutViewModel);
    }

    private async onRouteChange(): Promise<void> {
        await this.refreshContent();
    }

    public dispose(): void {
        this.routeHandler.removeRouteChangeListener(this.onRouteChange);
    }
}