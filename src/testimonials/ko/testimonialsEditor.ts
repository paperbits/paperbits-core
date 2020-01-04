import * as ko from "knockout";
import template from "./testimonialsEditor.html";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { TestimonialsModel } from "../testimonialsModel";


@Component({
    selector: "testimonials-editor",
    template: template
})
export class TestimonialsEditor {
    public textContent: ko.Observable<string>;
    public starsCount: ko.Observable<number>;
    public starsMaximum: ko.Observable<number>;
    public author: ko.Observable<string>;
    public authorTitle: ko.Observable<string>;

    constructor() {
        this.textContent = ko.observable<string>();
        this.author = ko.observable<string>();
        this.authorTitle = ko.observable<string>();
        this.starsCount = ko.observable<number>().extend(<any>{ max: 10 });
        this.starsMaximum = ko.observable<number>().extend(<any>{ max: 10 });
    }

    @Param()
    public model: TestimonialsModel;

    @Event()
    public onChange: (model: TestimonialsModel) => void;

    @OnMounted()
    public initialize(): void {
        this.textContent(this.model.textContent);
        this.starsCount(this.model.starsCount);
        this.starsMaximum(this.model.allStarsCount);
        this.author(this.model.author);
        this.authorTitle(this.model.authorTitle);

        this.textContent.subscribe(this.applyChanges);
        this.starsCount.subscribe(this.applyChanges);
        this.starsMaximum.subscribe(this.applyChanges);
        this.author.subscribe(this.applyChanges);
        this.authorTitle.subscribe(this.applyChanges);


    }

    private applyChanges(): void {
        this.model.textContent = this.textContent();
        this.model.starsCount = +this.starsCount();
        const count = +this.starsMaximum();
        this.model.allStarsCount = count <= 10 ? count : 10;
        this.model.author = this.author();
        this.model.authorTitle = this.authorTitle();
        this.onChange(this.model);
    }
}
