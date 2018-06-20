import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { TextblockViewModelBinder } from "../textblockViewModelBinder";
import { TextblockViewModel } from "./textblockViewModel";
import { HtmlEditorBindingHandler } from "../../ko/bindingHandlers/bindingHandlers.htmlEditor";

export class TextblockModule implements IInjectorModule {
    constructor(
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {
        injector.bind("textblock", TextblockViewModel);
        injector.bindSingleton("htmlEditorBindingHandler", HtmlEditorBindingHandler);
        injector.bind("textblockViewModelBinder", TextblockViewModelBinder);
        this.viewModelBinders.push(injector.resolve("textblockViewModelBinder"));
    }
}