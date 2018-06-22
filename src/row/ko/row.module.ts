import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { RowViewModel } from "./rowViewModel";
import { RowModelBinder } from "../rowModelBinder";
import { RowViewModelBinder } from "./rowViewModelBinder";

export class RowModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {
        injector.bind("row", RowViewModel);

        injector.bind("rowModelBinder", RowModelBinder);
        this.modelBinders.push(injector.resolve("rowModelBinder"));

        injector.bind("rowViewModelBinder", RowViewModelBinder);
        this.viewModelBinders.push(injector.resolve("rowViewModelBinder"));
    }
}