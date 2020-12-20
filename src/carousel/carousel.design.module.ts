import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { CarouselViewModel } from "./ko/carousel";
import { CarouselModelBinder } from "./carouselModelBinder";
import { CarouselViewModelBinder } from "./ko/carouselViewModelBinder";
import { IWidgetHandler } from "@paperbits/common/editing";
import { CarouselHandlers } from "./carouselHandlers";
import { CarouselItemHandlers } from "./carouselItemHandlers";
import { CarouselEditor } from "./ko";
import { CarouselItemEditor } from "./ko/carouselItemEditor";

export class CarouselDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("carousel", CarouselViewModel);
        injector.bind("carouselEditor", CarouselEditor);
        injector.bind("carouselItemEditor", CarouselItemEditor);
        injector.bindToCollection("modelBinders", CarouselModelBinder, "carouselModelBinder");
        injector.bindToCollection("viewModelBinders", CarouselViewModelBinder);
        injector.bindToCollection<IWidgetHandler>("widgetHandlers", CarouselHandlers, "carouselHandler");
        injector.bindToCollection<IWidgetHandler>("widgetHandlers", CarouselItemHandlers, "carouselItemHandler");
    }
}