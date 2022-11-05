import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { TextblockViewModelBinder } from "./textblockViewModelBinder";
import { TextblockViewModel } from "./ko/textblockViewModel";
import { TextblockModelBinder } from "./textblockModelBinder";
import { HtmlEditorBindingHandler } from "../ko/bindingHandlers/bindingHandlers.htmlEditor";
import { InlineModelBinder } from "../text/modelBinders/inlineModelBinder";
import { BlockModelBinder } from "../text/modelBinders/blockModelBinder";
import { ListModelBinder } from "../text/modelBinders/listModelBinder";
import { IWidgetService } from "@paperbits/common/widgets";
import { TextblockModel } from "./textblockModel";
import { TextblockHandlers } from "./textblockHandlers";
import { KnockoutComponentBinder } from "../ko/knockoutComponentBinder";


export class TextblockPublishModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("textblock", TextblockViewModel);
        injector.bindToCollection("modelBinders", InlineModelBinder);
        injector.bindToCollection("modelBinders", BlockModelBinder);
        injector.bindToCollection("modelBinders", ListModelBinder);
        injector.bindToCollection("autostart", HtmlEditorBindingHandler);
        
        injector.bindSingleton("textblockModelBinder", TextblockModelBinder);
        injector.bindSingleton("textblockViewModelBinder", TextblockViewModelBinder);
        injector.bindSingleton("textblockHandler", TextblockHandlers);

        const widgetService = injector.resolve<IWidgetService>("widgetService");

        widgetService.registerWidget("text-block", {
            modelDefinition: TextblockModel,
            componentBinder: KnockoutComponentBinder,
            componentDefinition: TextblockViewModel,
            modelBinder: TextblockModelBinder,
            viewModelBinder: TextblockViewModelBinder
        });
    }
}