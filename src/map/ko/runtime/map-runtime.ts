import * as ko from "knockout";
import template from "./map-runtime.html";
import { Component, Param, RuntimeComponent, OnMounted } from "@paperbits/common/ko/decorators";


@RuntimeComponent({
    selector: "map-runtime"
})
@Component({
    selector: "map-runtime",
    template: template
})
export class MapRuntime {
    constructor() {
        this.caption = ko.observable();
        this.layout = ko.observable();
        this.location = ko.observable();
        this.zoom = ko.observable();
        this.mapType = ko.observable();
        this.apiKey = ko.observable();
        this.markerIcon = ko.observable();
        this.markerPopupKey = ko.observable();
        this.customizations = ko.observable();
    }

    @Param()
    public caption: ko.Observable<string>;

    @Param()
    public layout: ko.Observable<string>;

    @Param()
    public location: ko.Observable<string>;

    @Param()
    public zoom: ko.Observable<number>;

    @Param()
    public mapType: ko.Observable<string>;

    @Param()
    public apiKey: ko.Observable<string>;

    @Param()
    public markerIcon: ko.Observable<string>;

    @Param()
    public markerPopupKey: ko.Observable<string>;

    @Param()
    public customizations: ko.Observable<any>;
}