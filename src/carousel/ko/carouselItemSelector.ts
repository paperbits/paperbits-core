import * as ko from "knockout";
import template from "./carouselItemSelector.html";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { CarouselItemModel } from "../carouselModel";


@Component({
    selector: "carousel-item-selector",
    template: template
})
export class CarouselItemSelector {
    public readonly carouselItems: ko.Observable<CarouselItemModel[]>;
    public readonly activeCarouselItem: ko.Observable<CarouselItemModel>;

    constructor() {
        this.carouselItems = ko.observable([]);
        this.activeCarouselItem = ko.observable();
    }

    @Param()
    public activeCarouselItemModel: CarouselItemModel = null;

    @Param()
    public carouselItemModels: CarouselItemModel[];

    @Event()
    public onSelect: (item: CarouselItemModel) => void;

    @Event()
    public onCreate: () => void;

    @OnMounted()
    public initialize(): void {
        this.carouselItems(this.carouselItemModels);
        this.activeCarouselItem(this.activeCarouselItemModel);
    }

    public selectCarouselItem(item: CarouselItemModel): void {
        if (this.onSelect) {
            this.onSelect(item);
        }
    }

    public addCarouselItem(): void {
        if (this.onCreate) {
            this.onCreate();
        }
    }
}