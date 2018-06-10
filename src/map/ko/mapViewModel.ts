import * as ko from "knockout";
import template from "./map.html";
import { Component } from "@paperbits/knockout/decorators/component";
import { MapService } from "../mapService";

@Component({
    selector: "paperbits-googlemaps",
    template: template
})
export class MapViewModel {
    public googleMapsLoaded: KnockoutObservable<boolean>;
    public location: KnockoutObservable<string>;
    public caption: KnockoutObservable<string>;
    public layout: KnockoutObservable<string>;
    public animation: KnockoutObservable<string>;
    public zoomControl: KnockoutObservable<string>;

    constructor(
        private readonly mapService: MapService
    ) {
        this.googleMapsLoaded = ko.observable(false);
        this.location = ko.observable<string>("Seattle, WA");
        this.caption = ko.observable<string>("Seattle, WA");
        this.layout = ko.observable<string>();
        this.zoomControl = ko.observable<string>("hide");

        this.init();
    }

    private async init(): Promise<void> {
        await this.mapService.loadGoogleMaps();

        this.googleMapsLoaded(true);
    }
}