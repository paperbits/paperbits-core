import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { TableOfContentsModelBinder } from "../tableOfContentsModelBinder";
import { TableOfContentsViewModelBinder } from "./tableOfContentsViewModelBinder";
import { IModelBinder } from "@paperbits/common/editing";

export class TableOfContentsModule implements IInjectorModule {
    public register(injector: IInjector): void { 
        injector.bind("tableOfContentsModelBinder", TableOfContentsModelBinder);
        const modelBinders = injector.resolve<Array<IModelBinder>>("modelBinders");
        modelBinders.push(injector.resolve("tableOfContentsModelBinder"));
        
        injector.bind("tableOfContentsViewModelBinder", TableOfContentsViewModelBinder);
        const viewModelBinders = injector.resolve<Array<IViewModelBinder<any, any>>>("viewModelBinders");
        viewModelBinders.push(injector.resolve("tableOfContentsViewModelBinder"));
    }
}