import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { IWidgetService } from "@paperbits/common/widgets";
import { KnockoutComponentBinder } from "../ko/knockoutComponentBinder";
import { BlockModelBinder } from "../text/modelBinders/blockModelBinder";
import { InlineModelBinder } from "../text/modelBinders/inlineModelBinder";
import { ListModelBinder } from "../text/modelBinders/listModelBinder";
import { TextblockViewModel } from "./ko/textblockViewModel";
import { TextblockModel } from "./textblockModel";
import { TextblockModelBinder } from "./textblockModelBinder";
import { TextblockViewModelBinder } from "./textblockViewModelBinder";


export class TextblockPublishModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("textblock", TextblockViewModel);
        injector.bindToCollection("modelBinders", InlineModelBinder);
        injector.bindToCollection("modelBinders", BlockModelBinder);
        injector.bindToCollection("modelBinders", ListModelBinder);
        injector.bindSingleton("textblockModelBinder", TextblockModelBinder);
        injector.bindSingleton("textblockViewModelBinder", TextblockViewModelBinder);

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