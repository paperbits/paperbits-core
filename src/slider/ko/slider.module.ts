import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { SliderModelBinder } from "../sliderModelBinder";
import { SliderViewModelBinder } from "./sliderViewModelBinder";
import { IModelBinder } from "@paperbits/common/editing";

export class SliderModule implements IInjectorModule {
    register(injector: IInjector): void {
        // injector.bind("sliderModelBinder", SliderModelBinder);
        const modelBinders = injector.resolve<Array<IModelBinder>>("modelBinders");        
        // modelBinders.push(injector.resolve("sliderModelBinder"));
        // injector.bind("sliderViewModelBinder", SliderViewModelBinder);
        const viewModelBinders = injector.resolve<Array<IViewModelBinder<any, any>>>("viewModelBinders");
        // viewModelBinders.push(injector.resolve("sliderViewModelBinder"));
    }
}