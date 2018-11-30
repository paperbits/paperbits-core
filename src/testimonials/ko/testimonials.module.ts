import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { TestimonialsModelBinder } from "../testimonialsModelBinder";
import { TestimonialsViewModelBinder } from "./testimonialsViewModelBinder";
import { IModelBinder } from "@paperbits/common/editing";

export class TestimonialsModule implements IInjectorModule {
    public register(injector: IInjector): void {   
        injector.bindToCollection("modelBinders", TestimonialsModelBinder);
        injector.bindToCollection("viewModelBinders", TestimonialsViewModelBinder);
    }
}