import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { ColumnViewModel } from "./columnViewModel";
import { ColumnModelBinder } from "../columnModelBinder";
import { ColumnViewModelBinder } from "./columnViewModelBinder";

export class ColumnModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {
        injector.bind("column", ColumnViewModel);
        injector.bind("columnModelBinder", ColumnModelBinder);
        // this.modelBinders.push(injector.resolve("columnModelBinder"));
        
        injector.bind("columnViewModelBinder", ColumnViewModelBinder);
        this.viewModelBinders.push(injector.resolve("columnViewModelBinder"));
    }
}