import * as ko from "knockout";
import template from "./slider.html";
import * as Utils from "@paperbits/common/utils";
import { SlideViewModel } from "./slideViewModel";
import { Component } from "@paperbits/common/ko/decorators";

@Component({
    selector: "slider",
    template: template
})
export class SliderViewModel {
    public id: string;
    public slides: ko.ObservableArray<SlideViewModel>;
    public slideSelectorStyle: ko.Observable<string>;
    public activeSlideNumber: ko.Observable<number>;
    public css: ko.Observable<string>;
    public style: ko.Observable<string>;

    constructor() {
        this.id = Utils.identifier();
        this.slides = ko.observableArray();
        this.css = ko.observable<string>();
        this.activeSlideNumber = ko.observable(0);
        this.style = ko.observable<string>();
    }
}