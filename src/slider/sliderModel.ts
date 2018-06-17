import { RowModel } from "../row/rowModel";
import { BackgroundModel } from "@paperbits/common/widgets/background";

export class SlideModel {
    public rows: RowModel[];
    public layout: string;
    public padding: string;
    public background: BackgroundModel;
    public thumbnail: BackgroundModel;

    constructor() {
        this.rows = [];
        this.background = new BackgroundModel();
        this.thumbnail = new BackgroundModel();
        this.layout = "container";
        this.padding = "with-padding";
    }
}

export class SliderModel {
    public slides: SlideModel[];
    public activeSlideNumber: number = 0;
    public size: string;
    public style: string;

    constructor() {
        this.size = "small";
        this.slides = [];
        this.style = "style1";
    }

    public previousSlide(): void {
        this.activeSlideNumber--;

        if (this.activeSlideNumber < 0) {
            this.activeSlideNumber = this.slides.length - 1;
        }
    }

    public nextSlide(): void {
        this.activeSlideNumber++;

        if (this.activeSlideNumber >= this.slides.length) {
            this.activeSlideNumber = 0;
        }
    }

    public removeSlide(slide: SlideModel): void {
        if (this.slides.length <= 1) {
            return;
        }

        let slideNumber = this.slides.indexOf(slide);

        this.slides.remove(slide);

        if (slideNumber == this.activeSlideNumber) {
            this.previousSlide();
        }
    }
}