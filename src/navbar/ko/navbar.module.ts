import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { NavbarViewModel } from "./navbarViewModel";
import { NavbarModelBinder } from "../navbarModelBinder";
import { NavbarViewModelBinder } from "./navbarViewModelBinder";

export class NavbarModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {    
        injector.bind("navbar", NavbarViewModel);    
        injector.bind("navbarModelBinder", NavbarModelBinder);        
        this.modelBinders.push(injector.resolve("navbarModelBinder"));
        
        injector.bind("navbarViewModelBinder", NavbarViewModelBinder);        
        this.viewModelBinders.push(injector.resolve("navbarViewModelBinder"));
    }
}