import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { TextblockViewModelBinder } from "../textblockViewModelBinder";
import { TextblockViewModel } from "./textblockViewModel";
import { TextblockModelBinder } from "../TextblockModelBinder";
import { HtmlEditorBindingHandler } from "../../ko/bindingHandlers/bindingHandlers.htmlEditor";
import { IModelBinder } from "@paperbits/common/editing";

export class TextblockModule implements IInjectorModule {
    register(injector: IInjector): void {
        injector.bind("textblock", TextblockViewModel);
        
        injector.bind("textModelBinder", TextblockModelBinder);
        const modelBinders = injector.resolve<Array<IModelBinder>>("modelBinders");
        modelBinders.push(injector.resolve("textModelBinder"));

        injector.bindSingleton("htmlEditorBindingHandler", HtmlEditorBindingHandler);
        
        injector.bind("textblockViewModelBinder", TextblockViewModelBinder);
        const viewModelBinders = injector.resolve<Array<IViewModelBinder<any, any>>>("viewModelBinders");
        viewModelBinders.push(injector.resolve("textblockViewModelBinder"));
    }
}