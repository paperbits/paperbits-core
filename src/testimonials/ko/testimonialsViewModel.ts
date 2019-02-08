import * as ko from "knockout";
import template from "./testimonials.html";
import { Component } from "@paperbits/common/ko/decorators";
import { changeRateLimit } from "../../ko/consts";

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
        this.textContent = ko.observable<string>().extend(changeRateLimit);
        this.allStarsCount = ko.observable<number>().extend(changeRateLimit);
        this.starsCount = ko.observable<number>().extend(changeRateLimit);
        this.author = ko.observable<string>().extend(changeRateLimit);
        this.authorTitle = ko.observable<string>().extend(changeRateLimit);
    }
}
