import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { ColumnViewModel } from "./columnViewModel";
import { ColumnModelBinder } from "../columnModelBinder";
import { ColumnViewModelBinder } from "./columnViewModelBinder";
import { IModelBinder } from "@paperbits/common/editing";
import { ColumnModel } from "../columnModel";

export class ColumnModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("column", ColumnViewModel);
        injector.bindToCollection<IModelBinder<ColumnModel>>("modelBinders", ColumnModelBinder);
        injector.bindToCollection("viewModelBinders", ColumnViewModelBinder);
    }
}