import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { MenuModelBinder } from "../menuModelBinder";
import { MenuViewModelBinder } from "./menuViewModelBinder";


export class MenuModule implements IInjectorModule {
    public register(injector: IInjector): void { 
        injector.bindToCollection("modelBinders", MenuModelBinder, "menuModelBinder");
        injector.bindToCollection("viewModelBinders", MenuViewModelBinder, "menuViewModelBinder");
    }
}