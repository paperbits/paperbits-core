import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { MenuModelBinder } from "../menuModelBinder";
import { MenuStyleHandler } from "../menuStyleHandler";
import { MenuViewModelBinder } from "./menuViewModelBinder";


export class MenuModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindToCollection("modelBinders", MenuModelBinder, "menuModelBinder");
        injector.bindToCollection("viewModelBinders", MenuViewModelBinder, "menuViewModelBinder");
        injector.bindInstanceToCollection("styleHandlers", MenuStyleHandler);
    }
}