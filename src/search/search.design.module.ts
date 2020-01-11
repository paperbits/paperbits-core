import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { SearchHandlers } from "./searchHandlers";
import { SearchViewModel, SearchViewModelBinder } from "./ko";
import { SearchModelBinder } from ".";


export class SearchDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("search", SearchViewModel);
        injector.bindToCollection("modelBinders", SearchModelBinder);
        injector.bindToCollection("viewModelBinders", SearchViewModelBinder);
        injector.bindToCollection("widgetHandlers", SearchHandlers);
    }
}