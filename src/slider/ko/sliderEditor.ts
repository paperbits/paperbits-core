import * as ko from "knockout";
import template from "./sliderEditor.html";
import { IWidgetEditor } from '@paperbits/common/widgets/IWidgetEditor';
import { MediaContract } from "@paperbits/common/media/mediaContract";
import { BackgroundModel } from "@paperbits/common/widgets/background/backgroundModel";
import { Component } from "@paperbits/common/ko/decorators";
import { SliderModel, SlideModel } from "../sliderModel";

export class SliderEditorSlide {
    public thumbnail: KnockoutObservable<BackgroundModel>;

    constructor() {
        this.thumbnail = ko.observable();
    }
}

@Component({
    selector: "paperbits-slider-editor",
    template: template,
    injectable: "sliderEditor"
})
export class SliderEditor implements IWidgetEditor {
    private sliderModel: SliderModel;
    private activeSlideModel: SlideModel;
    private applyChangesCallback: () => void;

    public readonly layout: KnockoutObservable<string>;
    public readonly padding: KnockoutObservable<string>;
    public readonly size: KnockoutObservable<string>;
    public readonly backgroundSize: KnockoutObservable<string>;
    public readonly backgroundPosition: KnockoutObservable<string>;
    public readonly backgroundColorKey: KnockoutObservable<string>;
    public readonly backgroundRepeat: KnockoutObservable<string>;
    public readonly background: KnockoutObservable<BackgroundModel>;
    public readonly thumbnail: KnockoutObservable<BackgroundModel>;
    public readonly backgroundSourceType: KnockoutObservable<string>;
    public readonly thumbnailUrl: KnockoutObservable<string>;
    public readonly style: KnockoutObservable<string>;

    public readonly slides: KnockoutObservableArray<SliderEditorSlide>;

    public readonly activeSlideNumber: KnockoutObservable<number>;


    constructor() {
        this.setWidgetModel = this.setWidgetModel.bind(this);
        this.onMediaSelected = this.onMediaSelected.bind(this);
        this.onThumbnailSelected = this.onThumbnailSelected.bind(this);
        this.clearBackground = this.clearBackground.bind(this);
        this.selectSlide = this.selectSlide.bind(this);

        this.layout = ko.observable<string>();
        this.layout.subscribe(this.onChange.bind(this));

        this.padding = ko.observable<string>();
        this.padding.subscribe(this.onChange.bind(this));

        this.size = ko.observable<string>();
        this.size.subscribe(this.onChange.bind(this));

        this.style = ko.observable<string>();
        this.style.subscribe(this.onChange.bind(this));

        this.backgroundSize = ko.observable<string>();
        this.backgroundSize.subscribe(this.onChange.bind(this));

        this.backgroundPosition = ko.observable<string>();
        this.backgroundPosition.subscribe(this.onChange.bind(this));

        this.backgroundColorKey = ko.observable<string>();
        this.backgroundColorKey.subscribe(this.onChange.bind(this));

        this.backgroundRepeat = ko.observable<string>();
        this.backgroundRepeat.subscribe(this.onChange.bind(this));

        this.background = ko.observable<BackgroundModel>();
        this.thumbnail = ko.observable<BackgroundModel>();

        this.backgroundSourceType = ko.observable<string>();

        this.activeSlideNumber = ko.observable<number>();
        this.slides = ko.observableArray<SliderEditorSlide>();
    }

    /**
     * Collecting changes from the editor UI and invoking callback method.
     */
    private onChange(): void {
        if (!this.applyChangesCallback) {
            return;
        }
        this.activeSlideModel.layout = this.layout();
        this.activeSlideModel.padding = this.padding();
        this.sliderModel.size = this.size();
        this.sliderModel.style = this.style();

        this.activeSlideModel.background.colorKey = this.backgroundColorKey();
        this.activeSlideModel.background.size = this.backgroundSize();
        this.activeSlideModel.background.position = this.backgroundPosition();
        this.activeSlideModel.background.repeat = this.backgroundRepeat();

        this.background.valueHasMutated();
        this.applyChangesCallback();
    }

    public onMediaSelected(media: MediaContract): void {
        this.activeSlideModel.background.sourceKey = media.permalinkKey;
        this.activeSlideModel.background.sourceUrl = media.downloadUrl;

        this.background.valueHasMutated();
        this.applyChangesCallback();
    }

    public onThumbnailSelected(media: MediaContract): void {
        this.activeSlideModel.thumbnail.sourceKey = media.permalinkKey;
        this.activeSlideModel.thumbnail.sourceUrl = media.downloadUrl;

        let sliderEditorSlide = this.slides()[this.sliderModel.activeSlideNumber]

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

    public setWidgetModel(sliderModel: SliderModel, applyChangesCallback?: () => void): void {
        this.sliderModel = sliderModel;

        this.setActiveSlide(sliderModel.slides[sliderModel.activeSlideNumber]);
        this.size(this.sliderModel.size);
        this.style(this.sliderModel.style);

        this.rebuildSlides();

        this.applyChangesCallback = applyChangesCallback;
    }

    private rebuildSlides(): void {
        const slideViewModels = this.sliderModel.slides.map((slide) => {
            const slideViewModel = new SliderEditorSlide();
            slideViewModel.thumbnail(slide.thumbnail);
            return slideViewModel;
        });
        this.slides(slideViewModels);
        this.activeSlideNumber(this.sliderModel.activeSlideNumber);
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
        let slideNumber = this.slides.indexOf(sliderEditorSlide);
        let slideModel = this.sliderModel.slides[slideNumber];

        this.sliderModel.activeSlideNumber = slideNumber;
        this.setActiveSlide(slideModel);
        this.activeSlideNumber(slideNumber);
        this.applyChangesCallback();
    }

    public comingSoon(): void {
        alert("This feature is coming soon!");
    }

    public addSlide(): void {
        let slide = new SlideModel();
        this.sliderModel.slides.push(slide);
        this.applyChangesCallback();
        this.rebuildSlides();
    }

    public deleteSlide(): void {
        let slideNumber = this.activeSlideNumber()
        let slideModel = this.sliderModel.slides[slideNumber];

        this.sliderModel.removeSlide(slideModel);

        this.applyChangesCallback();
        this.rebuildSlides();
    }
}