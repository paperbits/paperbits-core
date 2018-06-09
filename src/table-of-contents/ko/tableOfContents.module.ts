import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { TableOfContentsModelBinder } from "../tableOfContentsModelBinder";
import { TableOfContentsViewModelBinder } from "./tableOfContentsViewModelBinder";

export class TableOfContentsModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void { 
        
        injector.bind("tableOfContentsModelBinder", TableOfContentsModelBinder);
        this.modelBinders.push(injector.resolve("tableOfContentsModelBinder"));
        
        injector.bind("tableOfContentsViewModelBinder", TableOfContentsViewModelBinder);
        this.viewModelBinders.push(injector.resolve("tableOfContentsViewModelBinder"));
    }
}