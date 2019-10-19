import * as ko from "knockout";
import template from "./viewport-selector.html";
import { IViewManager } from "@paperbits/common/ui";
import { Component } from "@paperbits/common/ko/decorators";
import { EventManager } from "@paperbits/common/events";

@Component({
    selector: "viewport-selector",
    template: template,
    injectable: "viewportSelector"
})
export class ViewportSelector {
    public readonly viewport: ko.Observable<string>;

    constructor(
        private readonly viewManager: IViewManager,
        private readonly eventManager: EventManager
    ) {
        this.viewManager = viewManager;
        this.viewport = ko.observable<string>("desktop");

        this.viewport(this.viewManager.getViewport());
    }

    public setXl(): void {
        this.viewport("xl");
        this.viewManager.setViewport("xl");
        this.eventManager.dispatchEvent("onViewportChange", "xl");  // TODO: onViewportChange should be triggered by browser resizing as well
    }

    public setLg(): void {
        this.viewport("lg");
        this.viewManager.setViewport("lg");
        this.eventManager.dispatchEvent("onViewportChange", "lg");
    }

    public setMd(): void {
        this.viewport("md");
        this.viewManager.setViewport("md");
        this.eventManager.dispatchEvent("onViewportChange", "md");
    }

    public setSm(): void {
        this.viewport("sm");
        this.viewManager.setViewport("sm");
        this.eventManager.dispatchEvent("onViewportChange", "sm");
    }

    public setXs(): void {
        this.viewport("xs");
        this.viewManager.setViewport("xs");
        this.eventManager.dispatchEvent("onViewportChange", "xs");
    }

    public zoomOut(): void {
        this.viewport("zoomout");
        this.viewManager.setViewport("zoomout");
    }
}