import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { SearchViewModel } from "./ko/searchViewModel";
import { SearchModelBinder } from "./searchModelBinder";
import { SearchViewModelBinder } from "./ko/searchViewModelBinder";


/**
 * Inversion of control module that registers publish-time dependencies.
 */
export class SearchPublishModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("widget", SearchViewModel);
        injector.bindToCollection("modelBinders", SearchModelBinder);
        injector.bindToCollection("viewModelBinders", SearchViewModelBinder);
    }
}