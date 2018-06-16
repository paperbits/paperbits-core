import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { PageViewModel } from "./pageViewModel";
import { PageModelBinder } from "../pageModelBinder";
import { PageViewModelBinder } from "./pageViewModelBinder";

export class PageModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {        
        injector.bind("pageWidget", PageViewModel);
        
        injector.bindSingleton("pageModelBinder", PageModelBinder);
        this.modelBinders.push(injector.resolve("pageModelBinder"));

        injector.bind("pageViewModelBinder", PageViewModelBinder);
        this.viewModelBinders.push(injector.resolve("pageViewModelBinder"));
    }
}