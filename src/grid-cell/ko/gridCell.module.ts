import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { GridCellViewModel } from "./gridCellViewModel";
import { GridCellModelBinder } from "../gridCellModelBinder";
import { GridCellViewModelBinder } from "./gridCellViewModelBinder";

export class GridCellModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("gridCell", GridCellViewModel);
        injector.bindToCollection("modelBinders", GridCellModelBinder, "gridCellModelBinder");
        injector.bindToCollection("viewModelBinders", GridCellViewModelBinder);
    }
}