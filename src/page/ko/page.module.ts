import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { IModelBinder } from "@paperbits/common/editing";
import { PageViewModel } from "./pageViewModel";
import { PageModelBinder } from "../pageModelBinder";
import { PageViewModelBinder } from "./pageViewModelBinder";

export class PageModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("pageWidget", PageViewModel);
        
        injector.bindSingleton("pageModelBinder", PageModelBinder);
        const modelBinders = injector.resolve<IModelBinder[]>("modelBinders");
        modelBinders.push(injector.resolve("pageModelBinder"));

        injector.bind("pageViewModelBinder", PageViewModelBinder);
        const viewModelBinders = injector.resolve<IViewModelBinder<any, any>[]>("viewModelBinders");
        viewModelBinders.push(injector.resolve("pageViewModelBinder"));
    }
}