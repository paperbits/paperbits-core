import * as ko from "knockout";
import template from "./testimonialsEditor.html";
import { IWidgetEditor } from "@paperbits/common/widgets/IWidgetEditor";
import { IViewManager } from "@paperbits/common/ui";
import { Component } from "../../ko/component";
import { TestimonialsModel } from "../testimonialsModel";
import { changeRateLimit } from "../../ko/consts";

@Component({
    selector: "testimonials-editor",
    template: template,
    injectable: "testimonialsEditor"
})
export class TestimonialsEditor implements IWidgetEditor {
    private model: TestimonialsModel;
    private applyChangesCallback: () => void;

    public textContent: KnockoutObservable<string>;
    public starsCount: KnockoutObservable<number>;
    public allStarsCount: KnockoutObservable<number>;
    public author: KnockoutObservable<string>;
    public authorTitle: KnockoutObservable<string>;

    constructor(
        private readonly viewManager: IViewManager
    ) {
        this.setWidgetModel = this.setWidgetModel.bind(this);
        this.onControlsUpdate = this.onControlsUpdate.bind(this);

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
        this.model.textContent  = this.textContent();
        this.model.starsCount  = +this.starsCount();
        this.model.allStarsCount  = +this.allStarsCount();
        this.model.author = this.author();
        this.model.authorTitle = this.authorTitle();
        this.applyChangesCallback();
    }

    public closeEditor(): void {
        this.viewManager.closeWidgetEditor();
    }
}
