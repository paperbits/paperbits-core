import * as ko from "knockout";
import template from "./mapEditor.html";
import { IWidgetEditor } from '@paperbits/common/widgets';
import { IViewManager } from '@paperbits/common/ui';
import { Component } from "../../ko/component";
import { MapModel } from "../mapModel";

@Component({
    selector: "paperbits-map-editor",
    template: template,
    injectable: "mapEditor"
})
export class MapEditor implements IWidgetEditor {
    private map: MapModel;
    private applyChangesCallback: () => void;

    public location: KnockoutObservable<string>;
    public caption: KnockoutObservable<string>;
    public zoomControl: KnockoutObservable<boolean>;
    public layout: KnockoutObservable<string>;

    constructor(
        private readonly viewManager: IViewManager
    ) {
        this.onLocationUpdate = this.onLocationUpdate.bind(this);
        this.onCaptionUpdate = this.onCaptionUpdate.bind(this);
        this.onLayoutUpdate = this.onLayoutUpdate.bind(this);
        this.onZoomControlUpdate = this.onZoomControlUpdate.bind(this);

        this.location = ko.observable<string>();
        this.location.subscribe(this.onLocationUpdate);

        this.caption = ko.observable<string>();
        this.caption.subscribe(this.onCaptionUpdate);

        this.zoomControl = ko.observable<boolean>(false);
        this.zoomControl.subscribe(this.onZoomControlUpdate);

        this.layout = ko.observable<string>();
        this.layout.subscribe(this.onLayoutUpdate);
    }

    private onCaptionUpdate(caption: string): void {
        this.map.caption = caption;
        this.applyChangesCallback();
    }

    private onLayoutUpdate(layout: string): void {
        this.map.layout = layout;
        this.applyChangesCallback();
    }

    private onLocationUpdate(location: string): void {
        this.map.location = location;
        this.applyChangesCallback();
    }

    private onZoomControlUpdate(enabled: boolean): void {
        if (enabled)
            this.map.zoomControl = "show";
        else
            this.map.zoomControl = "hide";

        this.applyChangesCallback();
    }

    public setWidgetModel(map: MapModel, applyChangesCallback?: () => void): void {
        this.map = map;
        this.applyChangesCallback = applyChangesCallback;

        this.location(map.location);
        this.caption(map.caption);
        this.layout(map.layout);
        this.zoomControl(this.map.zoomControl === "show");
    }

    public closeEditor(): void {
        this.viewManager.closeWidgetEditor();
    }
}