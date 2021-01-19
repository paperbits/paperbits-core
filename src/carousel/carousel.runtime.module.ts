import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { CarouselHTMLElement } from "./ko/runtime/carousel-runtime";

export class CarouselRuntimeModule implements IInjectorModule {
    public register(injector: IInjector): void {
        const carouselComponentName = "carousel-runtime";
        customElements.define(carouselComponentName, CarouselHTMLElement);
    }
}

