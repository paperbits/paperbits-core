import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { TestimonialsModelBinder } from "../testimonialsModelBinder";
import { TestimonialsViewModelBinder } from "./testimonialsViewModelBinder";

export class TestimonialsModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {        

        injector.bind("testimonialsModelBinder", TestimonialsModelBinder);
        this.modelBinders.push(injector.resolve("testimonialsModelBinder"));

        injector.bind("testimonialsViewModelBinder", TestimonialsViewModelBinder);
        this.viewModelBinders.push(injector.resolve("testimonialsViewModelBinder"));
    }
}