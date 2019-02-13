import * as ko from "knockout";
import template from "./testimonialsEditor.html";
import { IWidgetEditor } from "@paperbits/common/widgets/IWidgetEditor";
import { Component } from "@paperbits/common/ko/decorators";
import { TestimonialsModel } from "../testimonialsModel";
import { changeRateLimit } from "../../ko/consts";

@Component({
    selector: "testimonials-editor",
    template: template,
    injectable: "testimonialsEditor"
})
export class TestimonialsEditor {
    private model: TestimonialsModel;
    private applyChangesCallback: () => void;

    public textContent: ko.Observable<string>;
    public starsCount: ko.Observable<number>;
    public allStarsCount: ko.Observable<number>;
    public author: ko.Observable<string>;
    public authorTitle: ko.Observable<string>;

    constructor() {
        this.textContent = ko.observable<string>().extend(changeRateLimit);
        this.starsCount = ko.observable<number>().extend(changeRateLimit);
        this.allStarsCount = ko.observable<number>().extend(changeRateLimit);
        this.author = ko.observable<string>().extend(changeRateLimit);
        this.authorTitle = ko.observable<string>().extend(changeRateLimit);

        this.textContent.subscribe(this.onControlsUpdate);
        this.starsCount.subscribe(this.onControlsUpdate);
        this.allStarsCount.subscribe(this.onControlsUpdate);
        this.author.subscribe(this.onControlsUpdate);
        this.authorTitle.subscribe(this.onControlsUpdate);
    }

    public setWidgetModel(testimonialsModel: TestimonialsModel, applyChangesCallback?: () => void): void {
        this.model = testimonialsModel;
        this.applyChangesCallback = applyChangesCallback;
        this.textContent(testimonialsModel.textContent);
        this.starsCount(testimonialsModel.starsCount);
        this.allStarsCount(testimonialsModel.allStarsCount);
        this.author(testimonialsModel.author);
        this.authorTitle(testimonialsModel.authorTitle);
    }

    private onControlsUpdate(): void {
        this.model.textContent = this.textContent();
        this.model.starsCount = +this.starsCount();
        const count = +this.allStarsCount();
        this.model.allStarsCount = count <= 10 ? count : 10;
        this.model.author = this.author();
        this.model.authorTitle = this.authorTitle();
        this.applyChangesCallback();
    }
}
