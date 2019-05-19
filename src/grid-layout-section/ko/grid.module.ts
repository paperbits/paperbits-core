import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { GridViewModel } from "./gridViewModel";
import { GridModelBinder } from "../gridModelBinder";
import { GridViewModelBinder } from "./gridViewModelBinder";

export class GridModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("gridViewModel", GridViewModel);
        injector.bindToCollection("modelBinders", GridModelBinder, "gridModelBinder");
        injector.bindToCollection("viewModelBinders", GridViewModelBinder, "gridViewModelBinder");
    }
}