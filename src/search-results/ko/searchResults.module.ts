import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { SearchResultsModelBinder } from "../searchResultsModelBinder";
import { SearchResultsViewModelBinder } from "./searchResultsViewModelBinder";
import { IModelBinder } from "@paperbits/common/editing";

export class SearchResultsModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindToCollection("modelBinders", SearchResultsModelBinder);
        injector.bindToCollection("viewModelBinders", SearchResultsViewModelBinder);
    }
}