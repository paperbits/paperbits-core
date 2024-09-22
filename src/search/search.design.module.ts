import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { SearchHandlers } from "./searchHandlers";
import { SearchViewModel, SearchViewModelBinder } from "./ko";
import { SearchInputModel, SearchModelBinder } from ".";
import { SearchInputEditor } from "./ko/searchInputEditor";
import { IWidgetService } from "@paperbits/common/widgets";
import { KnockoutComponentBinder } from "../ko";


export class SearchDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("search", SearchViewModel);
        injector.bind("searchInputEditor", SearchInputEditor);
        injector.bindSingleton("searchModelBinder", SearchModelBinder);
        injector.bindSingleton("searchViewModelBinder", SearchViewModelBinder);
        injector.bindSingleton("searchHandlers", SearchHandlers);

        const widgetService = injector.resolve<IWidgetService>("widgetService");

        widgetService.registerWidget("input:search", {
            modelDefinition: SearchInputModel,
            componentBinder: KnockoutComponentBinder,
            componentDefinition: SearchViewModel,
            modelBinder: SearchModelBinder,
            viewModelBinder: SearchViewModelBinder
        });

        widgetService.registerWidgetEditor("input:search", {
            displayName: "Search",
            iconClass: "widget-icon widget-icon-search-box",
            componentBinder: KnockoutComponentBinder,
            componentDefinition: SearchInputEditor,
            handlerComponent: SearchHandlers
        });
    }
}