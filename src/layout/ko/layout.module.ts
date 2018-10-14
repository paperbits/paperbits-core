import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { LayoutViewModel } from "./layoutViewModel";
import { LayoutModelBinder } from "../layoutModelBinder";
import { LayoutViewModelBinder } from "./layoutViewModelBinder";

export class LayoutModule implements IInjectorModule {
    register(injector: IInjector): void {        
        injector.bind("layoutWidget", LayoutViewModel);
        injector.bind("layoutModelBinder", LayoutModelBinder);
        //this.modelBinders.push(injector.resolve("layoutModelBinder"));

        injector.bind("layoutViewModelBinder", LayoutViewModelBinder);
        const viewModelBinders = injector.resolve<IViewModelBinder<any, any>[]>("viewModelBinders");
        viewModelBinders.push(injector.resolve("layoutViewModelBinder"));
    }
}