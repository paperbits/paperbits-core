import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { IWidgetService } from "@paperbits/common/widgets";
import { KnockoutComponentBinder } from "../ko/knockoutComponentBinder";
import { DismissButtonModel } from "./dismissButtonModel";
import { DismissButtonModelBinder } from "./dismissButtonModelBinder";
import { DismissButton } from "./ko/dismissButtonViewModel";
import { DismissButtonViewModelBinder } from "./ko/dismissButtonViewModelBinder";


export class DismissButtonPublishModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("dismissButton", DismissButton);
        injector.bindToCollection("modelBinders", DismissButtonModelBinder);
        injector.bindToCollection("viewModelBinders", DismissButtonViewModelBinder);

        const widgetService = injector.resolve<IWidgetService>("widgetService");
        
        widgetService.registerWidget("dismiss-button", {
            modelDefinition: DismissButtonModel,
            componentBinder: KnockoutComponentBinder,
            componentDefinition: DismissButton,
            modelBinder: DismissButtonModelBinder,
            viewModelBinder: DismissButtonViewModelBinder
        });
    }
}