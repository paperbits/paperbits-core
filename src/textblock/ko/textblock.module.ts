import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { TextblockViewModelBinder } from "../textblockViewModelBinder";
import { TextblockViewModel } from "./textblockViewModel";
import { TextblockModelBinder } from "../textblockModelBinder";
import { HtmlEditorBindingHandler } from "../../ko/bindingHandlers/bindingHandlers.htmlEditor";
import { InlineModelBinder } from "../../text/modelBinders/inlineModelBinder";
import { BlockModelBinder } from "../../text/modelBinders/blockModelBinder";
import { ListModelBinder } from "../../text/modelBinders/listModelBinder";

export class TextblockModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("textblock", TextblockViewModel);
        injector.bindToCollection("modelBinders", InlineModelBinder);
        injector.bindToCollection("modelBinders", BlockModelBinder);
        injector.bindToCollection("modelBinders", ListModelBinder);
        injector.bindToCollection("modelBinders", TextblockModelBinder);
        injector.bindToCollection("viewModelBinders", TextblockViewModelBinder);
        injector.bindToCollection("autostart", HtmlEditorBindingHandler);
    }
}