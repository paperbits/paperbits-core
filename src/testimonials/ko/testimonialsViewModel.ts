import * as ko from "knockout";
import template from "./testimonials.html";
import { Component } from "@paperbits/common/ko/decorators";

@Component({
    selector: "testimonials",
    template: template
})
export class TestimonialsViewModel {
    public textContent: ko.Observable<string>;
    public starsCount: ko.Observable<number>;
    public allStarsCount: ko.Observable<number>;
    public author: ko.Observable<string>;
    public authorTitle: ko.Observable<string>;

    constructor() {
        this.textContent = ko.observable<string>();
        this.allStarsCount = ko.observable<number>();
        this.starsCount = ko.observable<number>();
        this.author = ko.observable<string>();
        this.authorTitle = ko.observable<string>();
    }
}
