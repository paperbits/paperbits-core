import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { LayoutViewModel } from "./layoutViewModel";
import { LayoutModelBinder } from "../layoutModelBinder";
import { LayoutViewModelBinder } from "./layoutViewModelBinder";

export class LayoutModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {        
        injector.bind("layoutWidget", LayoutViewModel);
        injector.bind("layoutModelBinder", LayoutModelBinder);
        //this.modelBinders.push(injector.resolve("layoutModelBinder"));

        injector.bind("layoutViewModelBinder", LayoutViewModelBinder);
        this.viewModelBinders.push(injector.resolve("layoutViewModelBinder"));
    }
}