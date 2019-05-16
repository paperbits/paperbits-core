import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { GridCellViewModel } from "./gridCellViewModel";
import { GridCellModelBinder } from "../gridCellModelBinder";
import { GridCellViewModelBinder } from "./gridCellViewModelBinder";
import { IModelBinder } from "@paperbits/common/editing";

export class GridCellModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("gridCell", GridCellViewModel);
        injector.bindToCollection<IModelBinder>("modelBinders", GridCellModelBinder, "gridCellModelBinder");
        injector.bindToCollection("viewModelBinders", GridCellViewModelBinder);
    }
}