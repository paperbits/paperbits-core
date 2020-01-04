import * as ko from "knockout";
import template from "./mapEditor.html";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { MapModel } from "../mapModel";

@Component({
    selector: "paperbits-map-editor",
    template: template
})
export class MapEditor {
    public location: ko.Observable<string>;
    public caption: ko.Observable<string>;
    public zoomControl: ko.Observable<boolean>;
    public layout: ko.Observable<string>;

    constructor() {
        this.location = ko.observable<string>();
        this.caption = ko.observable<string>();
        this.zoomControl = ko.observable<boolean>(false);
        this.layout = ko.observable<string>();
    }

    @Param()
    public model: MapModel;

    @Event()
    public onChange: (model: MapModel) => void;

    @OnMounted()
    public initialize(): void {
        this.location(this.model.location);
        this.caption(this.model.caption);
        this.layout(this.model.layout);
        this.zoomControl(this.model.zoomControl === "show");

        this.location.subscribe(this.onLocationUpdate);
        this.caption.subscribe(this.onCaptionUpdate);
        this.zoomControl.subscribe(this.onZoomControlUpdate);
        this.layout.subscribe(this.onLayoutUpdate);
    }

    private onCaptionUpdate(caption: string): void {
        this.model.caption = caption;
        this.onChange(this.model);
    }

    private onLayoutUpdate(layout: string): void {
        this.model.layout = layout;
        this.onChange(this.model);
    }

    private onLocationUpdate(location: string): void {
        this.model.location = location;
        this.onChange(this.model);
    }

    private onZoomControlUpdate(enabled: boolean): void {
        if (enabled) {
            this.model.zoomControl = "show";
        }
        else {
            this.model.zoomControl = "hide";
        }

        this.onChange(this.model);
    }
}