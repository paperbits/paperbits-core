import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { TableViewModel } from "./ko/tableViewModel";
import { TableModelBinder } from "./tableModelBinder";
import { TableViewModelBinder } from "./ko/tableViewModelBinder";
import { TableHandlers } from "./tableHandlers";
import { TableColumnEditor } from "./ko/tableColumnEditor";
import { TableEditor } from "./ko/tableEditor";
import { TableRowEditor } from "./ko/tableRowEditor";


export class TableDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("tableViewModel", TableViewModel);
        injector.bindToCollection("modelBinders", TableModelBinder, "tableModelBinder");
        injector.bindToCollection("viewModelBinders", TableViewModelBinder, "tableViewModelBinder");
        injector.bindToCollection("widgetHandlers", TableHandlers, "tableHandler");
        injector.bind("tableEditor", TableEditor);
        injector.bind("tableColumnEditor", TableColumnEditor);
        injector.bind("tableRowEditor", TableRowEditor);
    }
}