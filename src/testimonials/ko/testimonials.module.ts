import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { TestimonialsModelBinder } from "../testimonialsModelBinder";
import { TestimonialsViewModelBinder } from "./testimonialsViewModelBinder";
import { IModelBinder } from "@paperbits/common/editing";

export class TestimonialsModule implements IInjectorModule {
    register(injector: IInjector): void {   
        injector.bind("testimonialsModelBinder", TestimonialsModelBinder);
        const modelBinders = injector.resolve<Array<IModelBinder>>("modelBinders");
        modelBinders.push(injector.resolve("testimonialsModelBinder"));

        injector.bind("testimonialsViewModelBinder", TestimonialsViewModelBinder);
        const viewModelBinders = injector.resolve<Array<IViewModelBinder<any, any>>>("viewModelBinders");
        viewModelBinders.push(injector.resolve("testimonialsViewModelBinder"));
    }
}