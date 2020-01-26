import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { ContentViewModel } from "./contentViewModel";
import { ContentModelBinder } from "../contentModelBinder";
import { ContentViewModelBinder } from "./contentViewModelBinder";


export class ContentModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("contentWidget", ContentViewModel);
        injector.bindToCollection("modelBinders", ContentModelBinder, "contentModelBinder");
        injector.bindToCollection("viewModelBinders", ContentViewModelBinder, "contentViewModelBinder");
    }
}