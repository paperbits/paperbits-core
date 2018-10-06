import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { NavbarViewModel } from "./navbarViewModel";
import { NavbarModelBinder } from "../navbarModelBinder";
import { NavbarViewModelBinder } from "./navbarViewModelBinder";
import { IModelBinder } from "@paperbits/common/editing";

export class NavbarModule implements IInjectorModule {
    public register(injector: IInjector): void {    
        injector.bind("navbar", NavbarViewModel);    
        injector.bind("navbarModelBinder", NavbarModelBinder);
        const modelBinders = injector.resolve<IModelBinder[]>("modelBinders");
        modelBinders.push(injector.resolve("navbarModelBinder"));
        
        injector.bind("navbarViewModelBinder", NavbarViewModelBinder);
        const viewModelBinders = injector.resolve<IViewModelBinder<any, any>[]>("viewModelBinders");
        viewModelBinders.push(injector.resolve("navbarViewModelBinder"));
    }
}