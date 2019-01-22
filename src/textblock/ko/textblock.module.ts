import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { TextblockViewModelBinder } from "../textblockViewModelBinder";
import { TextblockViewModel } from "./textblockViewModel";
import { TextblockModelBinder } from "../TextblockModelBinder";
import { HtmlEditorBindingHandler } from "../../ko/bindingHandlers/bindingHandlers.htmlEditor";
import { IModelBinder } from "@paperbits/common/editing";

export class TextblockModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("textblock", TextblockViewModel);
        injector.bindToCollection("modelBinders", TextblockModelBinder);
        injector.bindToCollection("viewModelBinders", TextblockViewModelBinder);
        injector.bindToCollection("autostart", HtmlEditorBindingHandler);
    }
}