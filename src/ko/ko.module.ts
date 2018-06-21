import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { DocumentViewModel } from "../document/documentViewModel";
import { GridBindingHandler } from "./bindingHandlers/bindingHandlers.grid";

export class KoModule implements IInjectorModule {
    register(injector: IInjector): void {
        injector.bind("docWidget", DocumentViewModel);
        injector.bindSingleton("gridBindingHandler", GridBindingHandler);
    }
}