import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { DocumentViewModel } from "../document/documentViewModel";
import { GridBindingHandler } from "./bindingHandlers/bindingHandlers.grid";

export class KoModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {
        injector.bind("docWidget", DocumentViewModel);
        injector.bindSingleton("gridBindingHandler", GridBindingHandler);
    }
}