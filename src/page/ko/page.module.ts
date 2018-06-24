import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { PageViewModel } from "./pageViewModel";
import { PageModelBinder } from "../pageModelBinder";
import { PageViewModelBinder } from "./pageViewModelBinder";
import { IModelBinder } from "@paperbits/common/editing";

export class PageModule implements IInjectorModule {
    register(injector: IInjector): void {        
        injector.bind("pageWidget", PageViewModel);
        
        injector.bindSingleton("pageModelBinder", PageModelBinder);
        const modelBinders = injector.resolve<Array<IModelBinder>>("modelBinders");
        modelBinders.push(injector.resolve("pageModelBinder"));

        injector.bind("pageViewModelBinder", PageViewModelBinder);
        const viewModelBinders = injector.resolve<Array<IViewModelBinder<any, any>>>("viewModelBinders");
        viewModelBinders.push(injector.resolve("pageViewModelBinder"));
    }
}