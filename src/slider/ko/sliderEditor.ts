import * as ko from "knockout";
import template from "./sliderEditor.html";
import { MediaContract } from "@paperbits/common/media/mediaContract";
import { BackgroundModel } from "@paperbits/common/widgets/background/backgroundModel";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { SliderModel, SlideModel } from "../sliderModel";

export class SliderEditorSlide {
    public thumbnail: ko.Observable<BackgroundModel>;

    constructor() {
        this.thumbnail = ko.observable();
    }
}

@Component({
    selector: "paperbits-slider-editor",
    template: template,
    injectable: "sliderEditor"
})
export class SliderEditor {
    private activeSlideModel: SlideModel;
    private applyChangesCallback: () => void;

    public readonly layout: ko.Observable<string>;
    public readonly padding: ko.Observable<string>;
    public readonly size: ko.Observable<string>;
    public readonly backgroundSize: ko.Observable<string>;
    public readonly backgroundPosition: ko.Observable<string>;
    public readonly backgroundColorKey: ko.Observable<string>;
    public readonly backgroundRepeat: ko.Observable<string>;
    public readonly background: ko.Observable<BackgroundModel>;
    public readonly thumbnail: ko.Observable<BackgroundModel>;
    public readonly backgroundSourceType: ko.Observable<string>;
    public readonly thumbnailUrl: ko.Observable<string>;
    public readonly style: ko.Observable<string>;
    public readonly slides: ko.ObservableArray<SliderEditorSlide>;
    public readonly activeSlideNumber: ko.Observable<number>;

    constructor() {
        this.layout = ko.observable<string>();
        this.padding = ko.observable<string>();
        this.size = ko.observable<string>();
        this.style = ko.observable<string>();
        this.backgroundSize = ko.observable<string>();
        this.backgroundPosition = ko.observable<string>();
        this.backgroundColorKey = ko.observable<string>();
        this.backgroundRepeat = ko.observable<string>();
        this.background = ko.observable<BackgroundModel>();
        this.thumbnail = ko.observable<BackgroundModel>();
        this.backgroundSourceType = ko.observable<string>();
        this.activeSlideNumber = ko.observable<number>();
        this.slides = ko.observableArray<SliderEditorSlide>();
    }

    @Param()
    public model: SliderModel;

    @Event()
    public onChange: (model: SlideModel) => void;

    @OnMounted()
    public initialize(): void {
        this.setActiveSlide(this.model.slides[this.model.activeSlideNumber]);
        this.size(this.model.size);
        this.style(this.model.style);

        this.rebuildSlides();

        this.layout.subscribe(this.applyChanges.bind(this));
        this.padding.subscribe(this.applyChanges.bind(this));
        this.size.subscribe(this.applyChanges.bind(this));
        this.style.subscribe(this.applyChanges.bind(this));
        this.backgroundSize.subscribe(this.applyChanges.bind(this));
        this.backgroundPosition.subscribe(this.applyChanges.bind(this));
        this.backgroundColorKey.subscribe(this.applyChanges.bind(this));
        this.backgroundRepeat.subscribe(this.applyChanges.bind(this));
    }

    /**
     * Collecting changes from the editor UI and invoking callback method.
     */
    private applyChanges(): void {
        if (!this.applyChangesCallback) {
            return;
        }
        this.activeSlideModel.layout = this.layout();
        this.activeSlideModel.padding = this.padding();
        this.model.size = this.size();
        this.model.style = this.style();

        this.activeSlideModel.background.colorKey = this.backgroundColorKey();
        this.activeSlideModel.background.size = this.backgroundSize();
        this.activeSlideModel.background.position = this.backgroundPosition();
        this.activeSlideModel.background.repeat = this.backgroundRepeat();

        this.background.valueHasMutated();
        this.applyChangesCallback();
    }

    public onMediaSelected(media: MediaContract): void {
        if (!media) {
            this.clearBackground();
            return;
        }
        
        this.activeSlideModel.background.sourceKey = media.key;
        this.activeSlideModel.background.sourceUrl = media.downloadUrl;

        this.background.valueHasMutated();
        this.applyChangesCallback();
    }

    public onThumbnailSelected(media: MediaContract): void {
        this.activeSlideModel.thumbnail.sourceKey = media.key;
        this.activeSlideModel.thumbnail.sourceUrl = media.downloadUrl;

        const sliderEditorSlide = this.slides()[this.model.activeSlideNumber];

        sliderEditorSlide.thumbnail.valueHasMutated();

        this.thumbnail.valueHasMutated();
        this.applyChangesCallback();
    }

    public clearBackground(): void {
        this.activeSlideModel.background.sourceKey = null;
        this.activeSlideModel.background.sourceUrl = null;
        this.activeSlideModel.background.sourceType = "none";

        this.backgroundSourceType("none");
        this.background.valueHasMutated();
        this.applyChangesCallback();
    }

    public setPictureBackground(): void {
        this.activeSlideModel.background.sourceKey = null;
        this.activeSlideModel.background.sourceUrl = null;
        this.activeSlideModel.background.sourceType = "picture";

        this.backgroundSourceType("picture");
        this.background.valueHasMutated();
        this.applyChangesCallback();
    }

    private rebuildSlides(): void {
        const slideViewModels = this.model.slides.map((slide) => {
            const slideViewModel = new SliderEditorSlide();
            slideViewModel.thumbnail(slide.thumbnail);
            return slideViewModel;
        });
        this.slides(slideViewModels);
        this.activeSlideNumber(this.model.activeSlideNumber);
    }

    private setActiveSlide(slideModel: SlideModel): void {
        this.activeSlideModel = slideModel;
        this.layout(slideModel.layout);
        this.padding(slideModel.padding);
        this.backgroundColorKey(slideModel.background.colorKey);
        this.backgroundPosition(slideModel.background.position);
        this.backgroundSize(slideModel.background.size);
        this.backgroundSourceType(slideModel.background.sourceType);
        this.backgroundRepeat(slideModel.background.repeat);
        this.background(slideModel.background);
        this.thumbnail(slideModel.thumbnail);
    }

    public selectSlide(sliderEditorSlide: SliderEditorSlide): void {
        const slideNumber = this.slides.indexOf(sliderEditorSlide);
        const slideModel = this.model.slides[slideNumber];

        this.model.activeSlideNumber = slideNumber;
        this.setActiveSlide(slideModel);
        this.activeSlideNumber(slideNumber);
        this.applyChangesCallback();
    }

    public comingSoon(): void {
        alert("This feature is coming soon!");
    }

    public addSlide(): void {
        const slide = new SlideModel();
        this.model.slides.push(slide);
        this.applyChangesCallback();
        this.rebuildSlides();
    }

    public deleteSlide(): void {
        const slideNumber = this.activeSlideNumber();
        const slideModel = this.model.slides[slideNumber];

        this.model.removeSlide(slideModel);

        this.applyChangesCallback();
        this.rebuildSlides();
    }
}