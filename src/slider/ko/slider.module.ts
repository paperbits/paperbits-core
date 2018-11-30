import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { SliderModelBinder } from "../sliderModelBinder";
import { SliderViewModelBinder } from "./sliderViewModelBinder";
import { IModelBinder } from "@paperbits/common/editing";

export class SliderModule implements IInjectorModule {
    public register(injector: IInjector): void { }
}