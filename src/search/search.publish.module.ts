import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { SearchViewModel } from "./ko/search";
import { SearchModelBinder } from "./searchModelBinder";
import { SearchViewModelBinder } from "./ko/searchViewModelBinder";
import { IWidgetService } from "@paperbits/common/widgets";
import { SearchInputModel } from "./searchInputModel";
import { KnockoutComponentBinder } from "../ko";


/**
 * Inversion of control module that registers publish-time dependencies.
 */
export class SearchPublishModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("search", SearchViewModel);
        injector.bindSingleton("searchModelBinder", SearchModelBinder);
        injector.bindSingleton("searchViewModelBinder", SearchViewModelBinder);

        const widgetService = injector.resolve<IWidgetService>("widgetService");

        widgetService.registerWidget("search", {
            modelDefinition: SearchInputModel,
            componentBinder: KnockoutComponentBinder,
            componentDefinition: SearchViewModel,
            modelBinder: SearchModelBinder,
            viewModelBinder: SearchViewModelBinder
        });
    }
}