import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { TableOfContentsModelBinder } from "../tableOfContentsModelBinder";
import { TableOfContentsViewModelBinder } from "./tableOfContentsViewModelBinder";


export class TableOfContentsModule implements IInjectorModule {
    public register(injector: IInjector): void { 
        injector.bindToCollection("modelBinders", TableOfContentsModelBinder, "tableOfContentsModelBinder");
        injector.bindToCollection("viewModelBinders", TableOfContentsViewModelBinder, "tableOfContentsViewModelBinder");
    }
}