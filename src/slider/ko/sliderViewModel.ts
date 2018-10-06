import * as ko from "knockout";
import template from "./slider.html";
import * as Utils from "@paperbits/common/utils";
import { SlideViewModel } from "./slideViewModel";
import { Component } from "../../ko/decorators/component.decorator";

@Component({
    selector: "slider",
    template: template
})
export class SliderViewModel {
    public id: string;
    public slides: KnockoutObservableArray<SlideViewModel>;
    public slideSelectorStyle: KnockoutObservable<string>;
    public activeSlideNumber: KnockoutObservable<number>;
    public css: KnockoutObservable<string>;
    public style: KnockoutObservable<string>;

    constructor() {
        this.id = Utils.identifier();
        this.slides = ko.observableArray();
        this.css = ko.observable<string>();
        this.activeSlideNumber = ko.observable(0);
        this.style = ko.observable<string>();
    }
}