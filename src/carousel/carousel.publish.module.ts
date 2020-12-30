import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { CarouselViewModel } from "./ko/carousel";
import { CarouselModelBinder } from "./carouselModelBinder";
import { CarouselViewModelBinder } from "./ko/carouselViewModelBinder";

export class CarouselPublishModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("carousel", CarouselViewModel);
        injector.bindToCollection("modelBinders", CarouselModelBinder, "carouselModelBinder");
        injector.bindToCollection("viewModelBinders", CarouselViewModelBinder);
    }
}