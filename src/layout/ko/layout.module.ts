import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { LayoutViewModel } from "./layoutViewModel";
import { LayoutModelBinder } from "../layoutModelBinder";
import { LayoutViewModelBinder } from "./layoutViewModelBinder";

export class LayoutModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("layout", LayoutViewModel);
        injector.bindToCollection("modelBinders", LayoutModelBinder, "layoutModelBinder");
        injector.bindToCollection("viewModelBinders", LayoutViewModelBinder, "layoutViewModelBinder");
    }
}