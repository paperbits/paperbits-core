import * as ko from "knockout";
import template from "./viewport-selector.html";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { Component } from "@paperbits/knockout/decorators";

@Component({
    selector: "viewport-selector",
    template: template,
    injectable: "viewportSelector"
})
export class ViewportSelector {
    private readonly viewManager: IViewManager;

    public viewport: KnockoutObservable<string>;

    constructor(viewManager: IViewManager) {
        this.viewManager = viewManager;
        this.viewport = ko.observable<string>("desktop");

        this.viewport(this.viewManager.getViewport());
    }

    public setXl(): void {
        this.viewport("xl");
        this.viewManager.setViewport("xl");
    }

    public setLg(): void {
        this.viewport("lg");
        this.viewManager.setViewport("lg");
    }

    public setMd(): void {
        this.viewport("md");
        this.viewManager.setViewport("md");
    }

    public setSm(): void {
        this.viewport("sm");
        this.viewManager.setViewport("sm");
    }

    public setXs(): void {
        this.viewport("xs");
        this.viewManager.setViewport("xs");
    }

    public zoomOut(): void {
        this.viewport("zoomout");
        this.viewManager.setViewport("zoomout");
    }
}