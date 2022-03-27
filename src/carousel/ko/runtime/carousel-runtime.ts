import { coerce } from "@paperbits/common";
import { Events } from "@paperbits/common/events";

export class CarouselHTMLElement extends HTMLElement {
    private currentSlideIndex: number;
    private autoplay: boolean;
    private pauseOnHover: boolean;
    private autoplayInterval: number;
    private autoplayHandler: any;

    constructor() {
        super();
        const activeSlideAttr = this.getAttribute("data-active-slide");
        const autoplayAttr = this.getAttribute("data-carousel-autoplay");
        const pauseOnHoverAttr = this.getAttribute("data-carousel-pauseonhover");
        const autoplayIntervalAttr = this.getAttribute("data-carousel-autoplay-interval");

        this.currentSlideIndex = !!activeSlideAttr
            ? parseInt(activeSlideAttr)
            : 0;

        this.autoplay = autoplayAttr === "true";
        this.pauseOnHover = pauseOnHoverAttr === "true";
        this.autoplayInterval = autoplayIntervalAttr ? parseInt(autoplayIntervalAttr) : 5000;
    }

    static get observedAttributes(): string[] {
        return ["data-active-slide", "data-carousel-autoplay", "data-carousel-autoplay-interval", "data-carousel-pauseonhover"];
    }

    public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (name !== "data-active-slide" && name !== "data-carousel-autoplay" && name !== "data-carousel-autoplay-interval" && name !== "data-carousel-pauseonhover") {
            return;
        }

        if ((!newValue && name !== "data-carousel-autoplay") || oldValue === newValue) {
            return;
        }

        switch (name) {
            case "data-carousel-autoplay-interval":
                this.autoplayInterval = parseInt(newValue);
                if (this.autoplay) {
                    this.disableAutoplay();
                    this.enableAutoplay();
                }
                break;
            case "data-carousel-autoplay":
                this.autoplay = newValue === "true";
                this.autoplay ? this.enableAutoplay() : this.disableAutoplay();
                break;
            case "data-active-slide":
                this.currentSlideIndex = parseInt(newValue);
                this.setActiveItem(this.currentSlideIndex);
                break;
            case "data-carousel-pauseonhover":
                this.pauseOnHover = newValue === "true";
                this.pauseOnHover ? this.enablePauseOnHover() : this.disablePauseOnHover();
                break;
            default:
                break;
        }
    }

    private setActiveItem = (index: number) => {
        this.style.setProperty("--slide", index.toString());

        const activeIndicator = this.querySelector(".carousel-indicator.active");

        if (activeIndicator) {
            activeIndicator.classList.remove("active");
        }

        setImmediate(() => {
            const carouselIndicators = coerce<HTMLDListElement>(this.querySelectorAll(".carousel-indicator"));
            if (carouselIndicators && carouselIndicators.length > 0) {
                carouselIndicators[index]?.classList.add("active");
            }
        });
    };

    private enableAutoplay = (): void => {
        this.disableAutoplay();
        this.autoplayHandler = setInterval(() => {
            this.nextSlide();
        }, this.autoplayInterval);
    }

    private disableAutoplay = (): void => {
        clearInterval(this.autoplayHandler);
    }

    private enablePauseOnHover = (): void => {
        if (this.autoplay) {
            const element = <HTMLElement>this;
            element.addEventListener("mouseover", this.disableAutoplay);
            element.addEventListener("mouseout", this.enableAutoplay);
        }
    }

    private disablePauseOnHover = (): void => {
        const element = <HTMLElement>this;
        element.removeEventListener("mouseover", this.disableAutoplay);
        element.removeEventListener("mouseout", this.enableAutoplay);
    }

    private nextSlide = (): void => {
        const element = <HTMLElement>this;
        const carouselItems = coerce<Element>(element.querySelectorAll(".carousel-item"));
        this.currentSlideIndex++;

        if (this.currentSlideIndex >= carouselItems.length) {
            this.currentSlideIndex = 0;
        }

        this.setActiveItem(this.currentSlideIndex);
    }

    private prevSlide = (): void => {
        const element = <HTMLElement>this;
        const carouselItems = coerce<Element>(element.querySelectorAll(".carousel-item"));
        this.currentSlideIndex--;

        if (this.currentSlideIndex < 0) {
            this.currentSlideIndex = carouselItems.length - 1;
        }

        this.setActiveItem(this.currentSlideIndex);
    }

    public connectedCallback(): void {
        const element = <HTMLElement>this;

        element.addEventListener(Events.Click, oEvent => {
            const clickElement = oEvent.composedPath()[0] as HTMLElement;
            const prevButton = clickElement.closest(".carousel-control-prev") ? true : false;
            const nextButton = clickElement.closest(".carousel-control-next") ? true : false;
            
            if (prevButton) {
                this.prevSlide();
            } else if (nextButton) {
                this.nextSlide();
            }
        });

        if (this.enablePauseOnHover) {
            this.enablePauseOnHover();
        }

        if (this.autoplay) {
            this.enableAutoplay();
        }
    }
}
