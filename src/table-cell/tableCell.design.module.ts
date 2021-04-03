import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { TableCellViewModel } from "./ko/tableCellViewModel";
import { TableCellModelBinder } from "./tableCellModelBinder";
import { TableCellViewModelBinder } from "./ko/tableCellViewModelBinder";
import { IWidgetHandler } from "@paperbits/common/editing";
import { TableCellHandlers } from "./tableCellHandlers";
import { TableCellEditor } from "./ko/tableCellEditor";


export class TableCellDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("tableCell", TableCellViewModel);
        injector.bindToCollection("modelBinders", TableCellModelBinder, "tableCellModelBinder");
        injector.bindToCollection("viewModelBinders", TableCellViewModelBinder);
        injector.bind("tableCellEditor", TableCellEditor);
        injector.bindToCollection<IWidgetHandler>("widgetHandlers", TableCellHandlers, "tableCellHandler");
    }
}