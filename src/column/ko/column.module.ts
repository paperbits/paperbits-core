import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { ColumnViewModel } from "./columnViewModel";
import { ColumnModelBinder } from "../columnModelBinder";
import { ColumnViewModelBinder } from "./columnViewModelBinder";
import { IModelBinder } from "@paperbits/common/editing";

export class ColumnModule implements IInjectorModule {
    register(injector: IInjector): void {
        injector.bind("column", ColumnViewModel);
        injector.bind("columnModelBinder", ColumnModelBinder);
        const modelBinders = injector.resolve<Array<IModelBinder>>("modelBinders");
        modelBinders.push(injector.resolve("columnModelBinder"));
        
        injector.bind("columnViewModelBinder", ColumnViewModelBinder);
        const viewModelBinders = injector.resolve<Array<IViewModelBinder<any, any>>>("viewModelBinders");
        viewModelBinders.push(injector.resolve("columnViewModelBinder"));
    }
}