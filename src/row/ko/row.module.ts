import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { RowViewModel } from "./rowViewModel";
import { RowModelBinder } from "../rowModelBinder";
import { RowViewModelBinder } from "./rowViewModelBinder";
import { IModelBinder } from "@paperbits/common/editing";

export class RowModule implements IInjectorModule {
    register(injector: IInjector): void {
        injector.bind("row", RowViewModel);

        injector.bind("rowModelBinder", RowModelBinder);
        const modelBinders = injector.resolve<Array<IModelBinder>>("modelBinders");
        modelBinders.push(injector.resolve("rowModelBinder"));

        injector.bind("rowViewModelBinder", RowViewModelBinder);
        const viewModelBinders = injector.resolve<Array<IViewModelBinder<any, any>>>("viewModelBinders");
        viewModelBinders.push(injector.resolve("rowViewModelBinder"));
    }
}