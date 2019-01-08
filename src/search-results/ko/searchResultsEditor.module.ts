import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler } from "@paperbits/common/editing";
import { SearchResultsHandlers } from "../searchResultsHandlers";

export class SearchResultsEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindToCollection<IWidgetHandler>("widgetHandlers", SearchResultsHandlers, "searchResultsHandler");
    }
}