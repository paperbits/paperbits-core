import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { TestimonialsModelBinder } from "../testimonialsModelBinder";
import { TestimonialsViewModelBinder } from "./testimonialsViewModelBinder";

export class TestimonialsModule implements IInjectorModule {
    public register(injector: IInjector): void {   
        injector.bindToCollection("modelBinders", TestimonialsModelBinder);
        injector.bindToCollection("viewModelBinders", TestimonialsViewModelBinder);
    }
}