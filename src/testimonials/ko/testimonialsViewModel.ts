import * as ko from "knockout";
import template from "./testimonials.html";
import { Component } from "../../ko/decorators/component.decorator";
import { changeRateLimit } from "../../ko/consts";

@Component({
    selector: "testimonials",
    template: template
})
export class TestimonialsViewModel {
    public textContent: KnockoutObservable<string>;
    public starsCount: KnockoutObservable<number>;
    public allStarsCount: KnockoutObservable<number>;
    public author: KnockoutObservable<string>;
    public authorTitle: KnockoutObservable<string>;

    constructor() {
        this.textContent = ko.observable<string>().extend(changeRateLimit);
        this.allStarsCount = ko.observable<number>().extend(changeRateLimit);
        this.starsCount = ko.observable<number>().extend(changeRateLimit);
        this.author = ko.observable<string>().extend(changeRateLimit);
        this.authorTitle = ko.observable<string>().extend(changeRateLimit);
    }
}
