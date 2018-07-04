import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler, IContentDropHandler } from "@paperbits/common/editing";
import { SearchResultsHandlers } from "../searchResultsHandlers";

export class SearchResultsEditorModule implements IInjectorModule {
    register(injector: IInjector): void {
        injector.bindSingleton("searchResultsHandlers", SearchResultsHandlers);

        const widgetHandlers:Array<IWidgetHandler> = injector.resolve("widgetHandlers");
        widgetHandlers.push(injector.resolve<SearchResultsHandlers>("searchResultsHandlers"));
    }
}