import * as ko from "knockout";
import template from "./carousel.html";
import { Component, OnMounted } from "@paperbits/common/ko/decorators";
import { StyleModel } from "@paperbits/common/styles";
import { CarouselItemViewModel } from "./carouselItemViewModel";

@Component({
    selector: "carousel",
    template: template
})
export class CarouselViewModel {
    public styles: ko.Observable<StyleModel>;
    public carouselItems: ko.ObservableArray<CarouselItemViewModel>;
    public activeItemIndex: ko.Observable<number>;
    public showControls: ko.Observable<boolean>;
    public showIndicators: ko.Observable<boolean>;
    public autoplay: ko.Observable<boolean>;
    public pauseOnHover: ko.Observable<boolean>;
    public autoplayInterval: ko.Observable<number>;

    constructor() {
        this.carouselItems = ko.observableArray<CarouselItemViewModel>();
        this.styles = ko.observable<StyleModel>();
        this.activeItemIndex = ko.observable(0);
        this.showControls = ko.observable<boolean>();
        this.showIndicators = ko.observable<boolean>();
        this.autoplay = ko.observable<boolean>();
        this.pauseOnHover = ko.observable<boolean>();
        this.autoplayInterval = ko.observable<number>();
    }
}