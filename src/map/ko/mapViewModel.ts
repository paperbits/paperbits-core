import * as ko from "knockout";
import template from "./map.html";
import { Component, OnMounted } from "@paperbits/common/ko/decorators";
import { MapService } from "../mapService";

@Component({
    selector: "paperbits-googleMaps",
    template: template
})
export class MapViewModel {
    public googleMapsLoaded: ko.Observable<boolean>;
    public location: ko.Observable<string>;
    public caption: ko.Observable<string>;
    public layout: ko.Observable<string>;
    public animation: ko.Observable<string>;
    public zoomControl: ko.Observable<string>;

    constructor(private readonly mapService: MapService) {
        this.onMounted = this.onMounted.bind(this);

        this.googleMapsLoaded = ko.observable(false);
        this.location = ko.observable<string>("Seattle, WA");
        this.caption = ko.observable<string>("Seattle, WA");
        this.layout = ko.observable<string>();
        this.zoomControl = ko.observable<string>("hide");
    }

    @OnMounted()
    public async onMounted(): Promise<void> {
        await this.mapService.loadGoogleMaps();

        this.googleMapsLoaded(true);
    }
}