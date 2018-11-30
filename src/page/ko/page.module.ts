import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { IModelBinder } from "@paperbits/common/editing";
import { PageViewModel } from "./pageViewModel";
import { PageModelBinder } from "../pageModelBinder";
import { PageViewModelBinder } from "./pageViewModelBinder";

export class PageModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("pageWidget", PageViewModel);
        injector.bindToCollection("modelBinders", PageModelBinder);
        injector.bindToCollection("viewModelBinders", PageViewModelBinder);
    }
}