import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { NavbarViewModel } from "./navbarViewModel";
import { NavbarModelBinder } from "../navbarModelBinder";
import { NavbarViewModelBinder } from "./navbarViewModelBinder";
import { IModelBinder } from "@paperbits/common/editing";

export class NavbarModule implements IInjectorModule {
    public register(injector: IInjector): void {    
        injector.bind("navbar", NavbarViewModel);    
        injector.bindToCollection("modelBinders", NavbarModelBinder, "navbarModelBinder");
        injector.bindToCollection("viewModelBinders", NavbarViewModelBinder);
    }
}