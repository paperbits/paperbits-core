import { coerce } from "@paperbits/common";

export class CarouselHTMLElement extends HTMLElement {
    private currentSlideIndex: number;

    constructor() {
        super();
        const activeSlideAttr = this.getAttribute("data-active-slide");

        this.currentSlideIndex = !!activeSlideAttr
            ? parseInt(activeSlideAttr)
            : 0;
    }

    static get observedAttributes(): string[] {
        return ["data-active-slide"];  // Check auto sliding!
    }

    public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (name !== "data-active-slide") {
            return;
        }

        if (!newValue || oldValue === newValue) {
            return;
        }

        this.currentSlideIndex = parseInt(newValue);
        this.setActiveItem(this.currentSlideIndex);
    }

    private setActiveItem = (index: number) => {
        this.style.setProperty("--slide", index.toString());


        const activeIndicator = this.querySelector(".carousel-indicator.active");

        if (activeIndicator) {
            activeIndicator.classList.remove("active");
        }

        setImmediate(() => {
            const carouselIndicators = coerce<HTMLDListElement>(this.querySelectorAll(".carousel-indicator"));
            carouselIndicators[index].classList.add("active");
        });
    };

    public connectedCallback(): void {
        const element = <HTMLElement>this;

        const prev = (): void => {
            const carouselItems = coerce<Element>(element.querySelectorAll(".carousel-item"));
            this.currentSlideIndex--;

            if (this.currentSlideIndex < 0) {
                this.currentSlideIndex = carouselItems.length - 1;
            }

            this.setActiveItem(this.currentSlideIndex);
        };

        const next = (): void => {
            const carouselItems = coerce<Element>(element.querySelectorAll(".carousel-item"));
            this.currentSlideIndex++;

            if (this.currentSlideIndex >= carouselItems.length) {
                this.currentSlideIndex = 0;
            }

            this.setActiveItem(this.currentSlideIndex);
        };

        const prevButton = element.querySelector<HTMLButtonElement>(".carousel-control-prev");
        prevButton.onclick = prev;

        const nextButton = element.querySelector<HTMLButtonElement>(".carousel-control-next");
        nextButton.onclick = next;
    }
}
