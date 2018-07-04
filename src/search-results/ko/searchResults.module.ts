import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { SearchResultsModelBinder } from "../searchResultsModelBinder";
import { SearchResultsViewModelBinder } from "./searchResultsViewModelBinder";
import { IModelBinder } from "@paperbits/common/editing";

export class SearchResultsModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("searchResultsModelBinder", SearchResultsModelBinder);
        const modelBinders = injector.resolve<Array<IModelBinder>>("modelBinders");
        modelBinders.push(injector.resolve("searchResultsModelBinder"));

        injector.bind("searchResultsViewModelBinder", SearchResultsViewModelBinder);
        const viewModelBinders = injector.resolve<Array<IViewModelBinder<any, any>>>("viewModelBinders");
        viewModelBinders.push(injector.resolve("searchResultsViewModelBinder"));
    }
}