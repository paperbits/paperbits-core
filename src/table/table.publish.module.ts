import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { TableViewModel } from "./ko/tableViewModel";
import { TableModelBinder } from "./tableModelBinder";
import { TableViewModelBinder } from "./ko/tableViewModelBinder";

export class TablePublishModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("tableViewModel", TableViewModel);
        injector.bindToCollection("modelBinders", TableModelBinder, "tableModelBinder");
        injector.bindToCollection("viewModelBinders", TableViewModelBinder, "tableViewModelBinder");
    }
}