import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { SliderModelBinder } from "../sliderModelBinder";
import { SliderViewModelBinder } from "./sliderViewModelBinder";

export class SliderModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {
        injector.bind("sliderModelBinder", SliderModelBinder);
        this.modelBinders.push(injector.resolve("sliderModelBinder"));
        injector.bind("sliderViewModelBinder", SliderViewModelBinder);
        this.viewModelBinders.push(injector.resolve("sliderViewModelBinder"));
    }
}