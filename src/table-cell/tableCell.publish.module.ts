import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { TableCellViewModel } from "./ko/tableCellViewModel";
import { TableCellModelBinder } from "./tableCellModelBinder";
import { TableCellViewModelBinder } from "./ko/tableCellViewModelBinder";


export class TableCellPublishModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("tableCell", TableCellViewModel);
        injector.bindToCollection("modelBinders", TableCellModelBinder, "tableCellModelBinder");
        injector.bindToCollection("viewModelBinders", TableCellViewModelBinder);
    }
}