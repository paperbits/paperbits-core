import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { TableOfContentsModelBinder } from "../tableOfContentsModelBinder";
import { TableOfContentsViewModelBinder } from "./tableOfContentsViewModelBinder";
import { IModelBinder } from "@paperbits/common/editing";

export class TableOfContentsModule implements IInjectorModule {
    public register(injector: IInjector): void { 
        injector.bindToCollection("modelBinders", TableOfContentsModelBinder, "tableOfContentsModelBinder");
        injector.bindToCollection("viewModelBinders", TableOfContentsViewModelBinder, "tableOfContentsViewModelBinder");
    }
}